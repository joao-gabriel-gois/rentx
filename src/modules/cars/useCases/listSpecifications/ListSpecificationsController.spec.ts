import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let counter = 0;
function createSpecificationInfo() {
  return {
    name: `Specification Supertest ${++counter}`,
    description: `Specification Supertest Description ${counter}`
  }
}

async function authenticateAdminUser() {
  const responseToken = await request(app).post('/sessions').send({
    email: 'admin@rentx.dev',
    password: 'admin'
  });

  return responseToken.body;
}

describe('List Specifications Controller', () => {
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

  it('should be able to list specifications', async () => {
    const { refresh_token } = await authenticateAdminUser();
    

    const firstSpecificationInfo = createSpecificationInfo();
    const secondSpecificationInfo = createSpecificationInfo();

    await request(app).post('/specifications').send(firstSpecificationInfo).set({
      Authorization: `Bearer ${refresh_token}`
    });

    await request(app).post('/specifications').send(secondSpecificationInfo).set({
      Authorization: `Bearer ${refresh_token}`
    });

    const response = await request(app).get('/specifications');
    
    expect(response.body).toEqual([
      expect.objectContaining(firstSpecificationInfo),
      expect.objectContaining(secondSpecificationInfo)
    ]);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[1].name).toEqual('Specification Supertest 2');

    expect(response.status).toBe(200);
  });
  
});