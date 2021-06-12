import Car from "@modules/cars/infra/typeorm/entities/Car";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import CarsRepositoryInMemory from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import RentsRepositoryInMemory from "@modules/rents/repositories/in-memory/RentsRepositoryInMemory";
import UsersRepositoryInMemory from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";

import ListRentsByUserUseCase from "./ListRentsByUserUseCase";

import addDaysFromNow from "@utils/dateHandler";


let usersRepository: IUsersRepository;
let carsRepository: ICarsRepository;
let rentsRepository: IRentsRepository;

let listRentsByUserUseCase: ListRentsByUserUseCase;

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

describe('List Rents By User', () => {
  beforeAll(() => {
    usersRepository = new UsersRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    rentsRepository = new RentsRepositoryInMemory();

    listRentsByUserUseCase = new ListRentsByUserUseCase(rentsRepository);
  });

  it('should be able to list all rents from a certain user', async () => {
    await usersRepository.createOrUpdate({
      name: "Test User",
      email: "test@user.com",
      password: '123456',
      driver_license: 'fbq1234321qwe',
    });

    const user = await usersRepository.findByEmail('test@user.com');
    
    let cars: Car[] = [];

    for (let i = 0; i < 5; i++) {
      const car = await createCar();
      cars.push(car)
      
      const tomorrowDate = addDaysFromNow(1);

      await rentsRepository.createOrUpdate({
        user_id: `${user!.id}`,
        car_id: car.id || 'no-car',
        expected_return_date: tomorrowDate
      });
    }


    const allRentsFromUser = await listRentsByUserUseCase.execute(`${user!.id}`);


    expect(allRentsFromUser.length).toBe(5);
    expect(allRentsFromUser).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 
          car_id: cars[0].id,
          user_id: user!.id
        })
      ])
    );

  });


});