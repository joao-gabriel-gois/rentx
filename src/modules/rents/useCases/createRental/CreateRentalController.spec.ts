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

let connection: Connection;
let user_id: string; // UUID
let refresh_token: string;

let responseCategory: Response;
let carsRepository: ICarsRepository;
let cars: Car[];

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

function parseResponse(response: Response): Rental {
  let currentRental: Rental;
  let { expected_return_date } = response.body;
  
  expected_return_date = new Date(expected_return_date);
  
  currentRental = {
    ...response.body,
    expected_return_date,
  };

  return currentRental;

}

describe('Create Rental Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    carsRepository = new CarsRepository();

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

    responseCategory = await request(app).post('/categories').send({
      name: 'Popular',
      description: 'Carros com alta rentabilidade e baixo custo'
    }).set({
        Authorization: `Bearer ${refresh_token}`
    });

    const category_id = responseCategory.body.id;

    // TENTAR COM USECASES EM VEZ DE REQUESTS
    await carsRepository.create({
      name: 'Gol',
      description: 'Gol bola famoso parsa',
      daily_rate: 120,
      license_plate: 'AAA-5555',
      fine_amount: 40,
      brand: 'Volkswagen',
      category_id,
    })

    await carsRepository.create({
      name: 'Ká',
      description: 'Compacto e econômica',
      daily_rate: 110,
      license_plate: 'ABA-3555',
      fine_amount: 20,
      brand: 'Ford',
      category_id,
    })

    cars = await carsRepository.findAvailableCars();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new rental', async () => {
    const rentalRequestData = {
      car_id: cars[0].id,
      expected_return_date: new Date(Date.now() +  48 * (60 * 60000)) // 2 days from now
    };

    const response = await request(app)
      .post('/rents')
      .send(rentalRequestData)
      .set({
        Authorization: `Bearer ${refresh_token}`
      });

    const parsedResponse = parseResponse(response);

    expect(response.status).toBe(201);
    expect(parsedResponse).toHaveProperty('id');
    expect(parsedResponse).toEqual(
      expect.objectContaining(rentalRequestData)
    );

  });


  it('should not be able to create a rental for an existing car', async () => {
    await createTestUser({
      name: 'Tester',
      email: 'tester@rentx.dev',
      password: 'tester'
    });

    const newUserAuthResponse = await request(app).post('/sessions').send({
      email: 'tester@rentx.dev',
      password: 'tester'
    });


    const rentalRequestData = {
      car_id: cars[0].id, // same car from previous test
      expected_return_date: new Date(Date.now() +  48 * (60 * 60000)) // 2 days from now
    };

    const response = await request(app)
      .post('/rents')
      .send(rentalRequestData)
      .set({
        Authorization: `Bearer ${newUserAuthResponse.body.refresh_token}` // different user from previous test
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Car is unavailable!'
    });
  });

  it('should not be able to create a rental for an user with another open rental', async () => {
    const rentalRequestData = {
      car_id: cars[1].id, // different car from first test
      expected_return_date: new Date(Date.now() +  48 * (60 * 60000)) // 2 days from now
    };

    const response = await request(app)
      .post('/rents')
      .send(rentalRequestData)
      .set({
        Authorization: `Bearer ${refresh_token}` // same user from first test
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'User has remaining rentals in progress!'
    }); 
  });

});

