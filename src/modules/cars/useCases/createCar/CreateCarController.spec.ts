import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request, { Response } from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let user_id: string; // UUID
let refresh_token: string;
let category: Response;

describe('Create Car Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user_id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
      values('${user_id}', 'admin', 'admin@rentx.dev', '${password}', 'XXXXXX', true, 'now()')`
    );

    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin'
    });

    refresh_token = responseToken.body.refresh_token;

    category = await request(app).post('/categories').send({
      name: 'Popular',
      description: 'Carros com alta rentabilidade e baixo custo'
    }).set({
        Authorization: `Bearer ${refresh_token}`
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new car', async () => {
    const category_id = category.body.id;

    const response = await request(app).post('/cars').send({
      name: 'Gol',
      description: 'Gol bola famoso parsa',
      daily_rate: 120,
      license_plate: 'AAA-5555',
      fine_amount: 40,
      brand: 'Volkswagen',
      category_id,
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });

    expect(response.status).toBe(201);
  });


  it('should not be able to create an existing car', async () => {
    const category_id = category.body.id;

    const response = await request(app).post('/cars').send({
      name: 'Gol',
      description: 'Gol bola famoso parsa',
      daily_rate: 120,
      license_plate: 'AAA-5555',
      fine_amount: 40,
      brand: 'Volkswagen',
      category_id
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });

    expect(response.status).toBe(400);
  });

});

