import request, { Response } from 'supertest';

import app from '@shared/infra/http/app';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import Car from '@modules/cars/infra/typeorm/entities/Car';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import { Connection, createConnection } from 'typeorm';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import CategoriesRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';

let connection: Connection;

let carsRepository: ICarsRepository;
let categoriesRepository : ICategoriesRepository;

let carsList: Car[] = [];

async function createTestCategory(categoryNumber: number) {
  await categoriesRepository.create({
    name: `Test Category ${categoryNumber}`,
    description: 'Test category description'
  });

  return await categoriesRepository.findByName(`Test Category ${categoryNumber}`);
}

async function createTestCar(carNumber: number, brand = 'Toyota') {
  const category = await createTestCategory(carNumber);

  return await carsRepository.create({
    name: `TestCar${carNumber + 1}`,
    description: 'Test car description',
    daily_rate: 70,
    license_plate: `${carNumber * (Math.random() * 1000)}`,
    fine_amount: 20,
    brand,
    category_id: category!.id!,
  });
}

function getRandomBrand() {
  const randomIndex = Math.floor(Math.random() * 10 / 2);
  const brandsArray = ['Volkswagen', 'Chevrolet', 'Audi', 'Citroen', 'Fiat'];

  return brandsArray[randomIndex];
}

function parseResponse(response: Response) {
  return response.body.map((currentCar: Car) => {
    const {daily_rate, fine_amount, created_at} = currentCar;

    return {
      ...currentCar,
      daily_rate: Number(daily_rate),
      fine_amount: Number(fine_amount),
      created_at: new Date(created_at)
    };
  });
}

describe('List Available Cars Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    carsRepository = new CarsRepository();
    categoriesRepository = new CategoriesRepository();
    
    const firstCar = await createTestCar(1);
    carsList.push({...firstCar});
    
    for (let i = 0; i < 10; i++) {
      const currentCar = await createTestCar(i + 2, getRandomBrand());

      carsList.push({...currentCar});
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to list all available cars', async () => {
    const allAvailableCars = await request(app).get('/cars/available').send();
    // response from controller are showing strings instead of numbers
    const parsedResponse = parseResponse(allAvailableCars);

    expect(allAvailableCars.status).toBe(200);
    expect(parsedResponse).toEqual(carsList);
  });

  it('should be able to list available cars by brand', async () => {
    const availableCarsByBrand = await request(app)
      .get('/cars/available?brand=Toyota')
      .send();

    const parsedResponse = parseResponse(availableCarsByBrand);
    expect(availableCarsByBrand.status).toBe(200);
    expect(parsedResponse).toEqual([carsList[0]]);
  });

  it('should be able to list available cars by name', async () => {
    const availableCarsByName = await request(app)
      .get('/cars/available?name=TestCar5') // first car created before loop so name will have index + 2 in name
      .send();

    const parsedResponse = parseResponse(availableCarsByName);
    expect(availableCarsByName.status).toBe(200);
    expect(parsedResponse).toEqual([carsList[3]]);
  });

  it('should be able to list available cars by category id', async () => {
    const availableCarsByCategoryId = await request(app)
      .get(`/cars/available?category_id=${carsList[1].category_id}`)
      .send();

    const parsedResponse = parseResponse(availableCarsByCategoryId);
    expect(availableCarsByCategoryId.status).toBe(200);
    expect(parsedResponse).toEqual([carsList[1]]);
  });
})