import { Connection } from 'typeorm';
import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let counter = 0;
function createCategoryInfo() {
  return {
    name: `Category Supertest ${++counter}`,
    description: `Category Supertest Description ${counter}`
  }
}

async function authenticateAdminUser() {
  const responseToken = await request(app).post('/sessions').send({
    email: 'admin@rentx.dev',
    password: 'admin'
  });

  return responseToken.body;
}

describe('List Categories Controller', () => {
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

  it('should be able to list categories', async () => {
    const { token } = await authenticateAdminUser();
    

    const firstCategoryInfo = createCategoryInfo();
    const secondCategoryInfo = createCategoryInfo();

    await request(app).post('/categories').send(firstCategoryInfo).set({
      Authorization: `Bearer ${token}`
    });

    await request(app).post('/categories').send(secondCategoryInfo).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get('/categories');
    
    expect(response.body).toEqual([
      expect.objectContaining(firstCategoryInfo),
      expect.objectContaining(secondCategoryInfo)
    ]);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[1].name).toEqual('Category Supertest 2');

    expect(response.status).toBe(200);
  });
  
});