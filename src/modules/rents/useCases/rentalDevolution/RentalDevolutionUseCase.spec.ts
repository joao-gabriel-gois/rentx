import Car from "@modules/cars/infra/typeorm/entities/Car";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import CarsRepositoryInMemory from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import RentsRepositoryInMemory from "@modules/rents/repositories/in-memory/RentsRepositoryInMemory";
import UsersRepositoryInMemory from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";

// Criar um user
// Criar um car
// Criar um rental

// E então o devolution
import addDaysFromNow from "@utils/dateHandler";
import Rental from "@modules/rents/infra/typeorm/entities/Rental";
import User from "@modules/accounts/infra/typeorm/entities/User";
import RentalDevolutionUseCase from "./RentalDevolutionUseCase";
import AppError from "@shared/errors/AppError";
import IDateProvider from "@shared/container/providers/DateProvider/IDateProvider";
import DayjsDateProvider from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let usersRepository: IUsersRepository;
let carsRepository: ICarsRepository;
let rentsRepository: IRentsRepository;

let rentalDevolutionUseCase: RentalDevolutionUseCase;

let dateProvider: IDateProvider;

let carNumber= 0;
async function createCar() {
  return await carsRepository.create({
    name: `Test ${++carNumber}`,
    description: 'Test description',
    daily_rate: 70,
    license_plate: 'AAA-4444',
    fine_amount: 20,
    brand: 'Volkswagen',
    category_id: 'any-category-id',
  });
}

let user: User | undefined;
let car: Car;
let rental: Rental;

describe('Rental Devolution', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    rentsRepository = new RentsRepositoryInMemory();

    await usersRepository.createOrUpdate({
      name: 'tester',
      email: 'test@t.dev',
      password: '123456',
      driver_license: 'AAA-12343'
    })

    user = await usersRepository.findByEmail('test@t.dev');
    car = await createCar();
    rental = await rentsRepository.createOrUpdate({
      user_id: user!.id!,
      car_id: car.id,
      expected_return_date: addDaysFromNow(2)
    });

    dateProvider = new DayjsDateProvider();
    rentalDevolutionUseCase = new RentalDevolutionUseCase(rentsRepository, carsRepository, dateProvider)
  });

  it('should be able to devolute a car and end the rental', async () => {
    const devolutedRental = await rentalDevolutionUseCase.execute(rental.id);

    expect(devolutedRental.end_date).not.toBe(null);
    expect(car.available).toBe(true);
  });

  it('should not be able to devolute a non existing Rental', async () => {
    await expect(
      rentalDevolutionUseCase.execute('non-existing-id')
    ).rejects.toEqual(new AppError('Rental does not exists!'));
  });


  it('should not be able to devolute a non existing car', async () => {
    const fakeRental = rental;
    Object.assign(fakeRental, {
      car_id: 'fake-car-id'
    });

    await expect(
      rentalDevolutionUseCase.execute(fakeRental.id)
    ).rejects.toEqual(new AppError('Car does not exists!'));
  });

});