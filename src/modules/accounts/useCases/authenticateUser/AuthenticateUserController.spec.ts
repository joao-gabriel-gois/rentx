import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const user_id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, admin, created_at)
      values('${user_id}', 'Administrator', 'admin@rentx.dev', '${password}', 'XXXXXX', true, 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate an user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'admin'
    });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');

    expect(response.body).toEqual(
      expect.objectContaining({
        user: {
          email: 'admin@rentx.dev',
          name: 'Administrator',
        }
      }),
    );

  });

  it('should not be able to authenticate a non-existing user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'non-existing-email-id@none.nil',
      password: 'admin'
    });

    expect(response.status).toBe(400);
  });

  it('should not be able to authenticate an user passing a wrong password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'admin@rentx.dev',
      password: 'wrong-password'
    });

    expect(response.status).toBe(400);
  });

});

