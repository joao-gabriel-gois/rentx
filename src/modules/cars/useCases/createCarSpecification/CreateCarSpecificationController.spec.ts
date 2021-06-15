import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request, { Response } from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';
import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import Car from '@modules/cars/infra/typeorm/entities/Car';
import Rental from '@modules/rents/infra/typeorm/entities/Rental';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import CategoriesRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import Specification from '@modules/cars/infra/typeorm/entities/Specification';
import CreateCarSpecificationUseCase from './CreateCarSpecificationUseCase';
import SpecificationsRepository from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';

let connection: Connection;
let user_id: string; // UUID
let refresh_token: string;


let categoriesRepository: ICategoriesRepository;
let specificationsRepository: ISpecificationsRepository;
let carsRepository: ICarsRepository;

let specifications: Specification[];
let car: Car;

async function createTestUser({
    name,
    email,
    password
  }: Omit<ICreateUserDTO, "driver_license">,
  isAdmin = false
) {
  user_id = uuid();
  password = await hash(password, 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
    values('${user_id}', '${name}', '${email}', '${password}', '${String(Math.random() * 132132123)}', '${isAdmin}', 'now()')`
  );
}

async function createTestSpecs(numberOfTimes: number) {
  for (let i = 0; i < numberOfTimes; i++) {
    await specificationsRepository.create({
      name: `Test Spec ${i}`,
      description: `Test Spec ${i} Description`
    });
  }
}

function parseCarSpecResponse(response: Response): void {
  const {
    created_at,
    specifications
  } = response.body;
  
  return {
    ...response.body,
    created_at: new Date(created_at),
    specifications: specifications.map((spec: Specification) => {
      return {
        ...spec,
        created_at: new Date(spec.created_at) 
      }
    })
  };
}

describe('Create Car Specification Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    carsRepository = new CarsRepository();
    categoriesRepository = new CategoriesRepository();
    specificationsRepository = new SpecificationsRepository();

    await createTestUser({
      name: 'admin',
      email: 'admin@rentx.dev',
      password: 'admin'
    }, true);

    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin'
    });

    refresh_token = responseToken.body.refresh_token;

    await categoriesRepository.create({
      name: 'Test Category',
      description: 'Test Category Description'
    });

    const category = await categoriesRepository.findByName('Test Category');

    // TENTAR COM USECASES EM VEZ DE REQUESTS
    await carsRepository.create({
      name: 'Gol',
      description: 'Gol bola famoso parsa',
      daily_rate: 120,
      license_plate: 'AAA-5555',
      fine_amount: 40,
      brand: 'Volkswagen',
      category_id: String(category!.id),
    })
    
    car = (await carsRepository.findAvailableCars())[0];

    await createTestSpecs(3);

    specifications = await specificationsRepository.list();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new car specification', async () => {
    const newCarSpecResponse = await request(app)
      .post(`/cars/specifications/${car.id}`)
      .send({
        specifications_id: specifications.map(spec => spec.id)
      })
      .set({
        authorization: `Bearer ${refresh_token}`
      });

    const parsedResponse = parseCarSpecResponse(newCarSpecResponse);

    expect(newCarSpecResponse.status).toBe(201);

    expect(parsedResponse).toEqual(
      expect.objectContaining({
        ...car,
        specifications: expect.arrayContaining(specifications)
      })
    )


  });

});

