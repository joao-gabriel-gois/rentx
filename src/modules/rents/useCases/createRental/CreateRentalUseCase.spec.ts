import dayjs from 'dayjs';

import RentsRepositoryInMemory from '@modules/rents/repositories/in-memory/RentsRepositoryInMemory';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import CreateRentalUseCase from '@modules/rents/useCases/createRental/CreateRentalUseCase';
import AppError from '@shared/errors/AppError';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import Car from '@modules/cars/infra/typeorm/entities/Car';


let rentsRepository: IRentsRepository;
let carsRepository: ICarsRepository;

let createRentalUseCase: CreateRentalUseCase;
let dateProvider: IDateProvider;

let car: Car;
let otherCar: Car;
let carNumber= 0;

async function createCar() {
  return await carsRepository.create({
    name: `Test ${++carNumber}`,
    description: 'Test description',
    daily_rate: 70,
    license_plate: 'AAA-4444',
    fine_amount: 20,
    brand: 'Wolskvagen',
    category_id: 'any-category-id',
  });
}

describe("Create Rental", () => {
  const tomorrowDate = dayjs().add(1, 'day').toDate();

  beforeAll(async () => {
    rentsRepository = new RentsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    carsRepository = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentsRepository,
      carsRepository,
      dateProvider
    );

    car = await createCar();
    otherCar = await createCar();
  });

  it('should be able to create a new rental, with updated car availability', async () => {  
    expect(car.available).toBe(true);
    
    const rental = await createRentalUseCase.execute({
      user_id: 'any-user-id',
      car_id: car.id,
      expected_return_date: tomorrowDate,
    });
    
    expect(car.available).toBe(false);
    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open rental for this car', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any-other-user-id',
        car_id: car.id,
        expected_return_date: tomorrowDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open rental for this same user', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any-user-id',
        car_id: otherCar.id,
        expected_return_date: tomorrowDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if duration lesser than 24 hours', () => {
    expect(async () => {
      const sixHoursFromNow = dayjs().add(6, 'hours').toDate();

      await createRentalUseCase.execute({
        user_id: 'any-other-user-id',
        car_id: otherCar.id,
        expected_return_date: sixHoursFromNow,
      });

    }).rejects.toBeInstanceOf(AppError);
  });
});