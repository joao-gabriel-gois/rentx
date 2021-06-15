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
let refresh_token: string;
let responseCategory: Response;

let availableCars: Car[];
let rental: Rental;
let rentedCarId: string;

let carsRepository: ICarsRepository;
let rentsRepository: IRentsRepository;

let dateProvider: IDateProvider;

let createRentalUseCase: CreateRentalUseCase;

function parseRentalResponse(response: Response): Rental[] {
  if (response.body) {
    return [...response.body].map((currentRental) => {
      let {
        created_at,
        updated_at,
        expected_return_date,
        car
      } = currentRental;

      const parseDate = (date: string) => new Date(date);

      currentRental = {
        ...currentRental,
        expected_return_date: parseDate(expected_return_date),
        created_at: parseDate(created_at),
        updated_at: parseDate(updated_at),
        car: {
          ...currentRental.car,
          created_at: parseDate(car.created_at),
        }

      };

      return currentRental;
    });
  } else {
    return [];
  }
}

describe('List Rents By User Controller', () => {
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
    
    refresh_token = responseToken.body.refresh_token;
    
    // Admin user creates a category
    responseCategory = await request(app).post('/categories').send({
      name: 'Popular',
      description: 'Carros com alta rentabilidade e baixo custo'
    }).set({
        Authorization: `Bearer ${refresh_token}`
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

    availableCars = await carsRepository.findAvailableCars();

    // Admin user rents to himself the first car only 
    rentedCarId = availableCars[0].id;
    const expected_return_date = new Date(Date.now() +  48 * (60 * 60000)); // 2 days from now

    rental = await createRentalUseCase.execute({
      user_id,
      car_id: rentedCarId,
      expected_return_date
    });

    // Updating available cars after rental
    availableCars = await carsRepository.findAvailableCars();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all rents by a certain user', async () => {
    // Check the list of cars rented by admin user
    const response = await request(app).get('/rents/user').set({
      Authorization: `Bearer ${refresh_token}`
    });
    const parsedResponse = parseRentalResponse(response);

    expect(response.status).toBe(200);
    

    expect(parsedResponse).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...rental,
          car: expect.objectContaining({
            available: false,
            id: rentedCarId
          })
        })
      ])
    );

    const isRentedCarAmongAvaialbleOnesAfterRental = availableCars.find(car => car.id === rentedCarId);

    expect(isRentedCarAmongAvaialbleOnesAfterRental).toBeUndefined();
    
  });

});