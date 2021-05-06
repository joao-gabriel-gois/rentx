import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
      values('${id}', 'admin', 'admin@rentx.dev', '${password}', 'XXXXXX', true, 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin'
    });

    const { token } = responseToken.body;


    const response = await request(app).post('/categories').send({
      name: 'Category Supertest',
      description: 'Category Supertest Description'
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  });


  it('should not be able to create a category with existing name', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin'
    });

    const { token } = responseToken.body;


    const response = await request(app).post('/categories').send({
      name: 'Category Supertest',
      description: 'Category Supertest Description'
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
  });

});

