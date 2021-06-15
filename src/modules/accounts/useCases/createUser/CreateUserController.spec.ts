import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';
import ICreateUserDTO from '@modules/accounts/DTOs/ICreateUserDTO';

let connection: Connection;
let newUserCredentials: ICreateUserDTO;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    newUserCredentials = {
      email: 'admin@rentx.dev',
      password: 'admin',
      name: 'Administrator',
      driver_license: '123123123-1231'
    };
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create an user', async () => {
    const response = await request(app).post('/users').send(newUserCredentials);

    expect(response.status).toBe(201);

  });

  it('should not be able to create an user that already exists', async () => {
    const response = await request(app).post('/users').send(newUserCredentials);

    expect(response.status).toBe(400);
  });

});

