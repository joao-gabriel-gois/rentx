import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;


describe('Send Forgot Password Controller', () => {
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

  it('should be able to send a forgot password email', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'admin@rentx.dev'
    });
    console.log(response.body);
    expect(response.status).toBe(200);
  });


  it('should not be able to send a forgot password email for a non existing user', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'non-existing@email.test'
    });

    expect(response.status).toBe(400);
    console.log(response.body);
  });
});