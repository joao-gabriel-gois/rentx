import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request, { Response } from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';
import Rental from '@modules/rents/infra/typeorm/entities/Rental';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import Car from '@modules/cars/infra/typeorm/entities/Car';
import CreateRentalUseCase from '../createRental/CreateRentalUseCase';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import RentsRepository from '@modules/rents/infra/typeorm/repositories/RentsRepository';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

let connection: Connection;
let token: string;
let responseCategory: Response;

let cars: Car[];
let rental: Rental;

let carsRepository: ICarsRepository;
let rentsRepository: IRentsRepository;

let dateProvider: IDateProvider;

let createRentalUseCase: CreateRentalUseCase;

function parseRentalResponse(response: Response): Rental | undefined {
  if (response.body) {
    let {
      created_at,
      updated_at,
      expected_return_date,
    } = response.body;

    const parseDate = (date: string) => new Date(date);

    return {
      ...response.body,
      expected_return_date: parseDate(expected_return_date),
      created_at: parseDate(created_at),
      updated_at: parseDate(updated_at),
    };
  } else {
    return undefined;
  }
}

describe('Rental Devolution Controller', () => {
  beforeAll(async () => {
    // DB starts
    connection = await createConnection();
    await connection.runMigrations();
    
    // Repos, providers and usecases required for test are instatiated
    carsRepository = new CarsRepository();
    rentsRepository = new RentsRepository();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentsRepository,
      carsRepository,
      dateProvider,
    );

    // Admin user is created
    const user_id = uuid();
    const password = await hash('admin', 8);
      
    
    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
      values('${user_id}', 'admin', 'admin@rentx.dev', '${password}', 'XXXXXX', true, 'now()')`
    );

    // Admin user authenticate
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin',
    });
    
    token = responseToken.body.token;
    
    // Admin user creates a category
    responseCategory = await request(app).post('/categories').send({
      name: 'Popular',
      description: 'Carros com alta rentabilidade e baixo custo'
    }).set({
        Authorization: `Bearer ${token}`
    });

    const category_id = responseCategory.body.id;

    // Admin user create 2 cars and save it in an array
    await carsRepository.create({
      name: 'Gol',
      description: 'Gol bola famoso parsa',
      daily_rate: 120,
      license_plate: 'AAA-5555',
      fine_amount: 40,
      brand: 'Volkswagen',
      category_id,
    });

    await carsRepository.create({
      name: 'Ká',
      description: 'Compacto e econômica',
      daily_rate: 110,
      license_plate: 'ABA-3555',
      fine_amount: 20,
      brand: 'Ford',
      category_id,
    });

    cars = await carsRepository.findAvailableCars();

    // Admin user rents to himself the first car only 
    const expected_return_date = new Date(Date.now() +  48 * (60 * 60000)); // 2 days from now
    rental = await createRentalUseCase.execute({
      user_id,
      car_id: cars[0].id,
      expected_return_date
    })
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to end a rental, returning a car', async () => {
    // Check the list of cars rented by admin user
    const carStatusBefore = await carsRepository.findById(rental.car_id);

    expect(carStatusBefore!.available).toBeFalsy(); // It was rented in beforeAll

    const response = await request(app).post(`/rents/devolution/${rental.id}`).set({
      Authorization: `Bearer ${token}`
    }); // Rental Devolution Happnes
    
    const parsedResponse = parseRentalResponse(response);

    expect(response.status).toBe(200);

    expect(parsedResponse).toEqual(expect.objectContaining(rental));

    const carStatusAfter = await carsRepository.findById(rental.car_id);

    expect(carStatusAfter!.available).toBeTruthy();
    
  });

});