import Car from "@modules/cars/infra/typeorm/entities/Car";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import IUsersRepository from "@modules/accounts/repositories/IUsersRepository";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import CarsRepositoryInMemory from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import RentsRepositoryInMemory from "@modules/rents/repositories/in-memory/RentsRepositoryInMemory";
import UsersRepositoryInMemory from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";

import ListRentsByUserUseCase from "./ListRentsByUserUseCase";

import { getDateObj, parseMonth } from "@utils/dateHandler";


let usersRepository: IUsersRepository;
let carsRepository: ICarsRepository;
let rentsRepository: IRentsRepository;

let listRentsByUserUseCase: ListRentsByUserUseCase;

describe('List Rents By User', () => {
  beforeAll(() => {
    usersRepository = new UsersRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    rentsRepository = new RentsRepositoryInMemory();

    listRentsByUserUseCase = new ListRentsByUserUseCase(rentsRepository);
  });

  it('should be able to list all rents from a certain user', async () => {
    await usersRepository.create({
      name: "Test User",
      email: "test@user.com",
      password: '123456',
      driver_license: 'fbq1234321qwe',
    });

    const user = await usersRepository.findByEmail('test@user.com');
    
    let testNumber = 0;
    let car: Car;

    for (testNumber; testNumber > 5; testNumber++) {
      car = await carsRepository.create({
        name: `Test ${testNumber}`,
        description: `Test ${testNumber} description`,
        daily_rate: 40,
        license_plate: `TST-${testNumber}`,
        fine_amount: 20,
        brand: `Turbo ${testNumber + 1}000x`,
        category_id: `fake-category-id-${testNumber}`
      });

      const today = getDateObj(new Date());
      const tomorrowDate = new Date(`${today.year}-${parseMonth(today.month)}-${today.day + 1}`);
      
      await rentsRepository.createOrUpdate({
        user_id: `${user!.id}`,
        car_id: car!.id,
        expected_return_date: tomorrowDate
      });
    }

    const allRentsFromUser = await listRentsByUserUseCase.execute(`${user!.id}`);

    expect(allRentsFromUser.length).toBe(5);
    expect(allRentsFromUser).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 
          car_id: car!.id,
          user_id: user!.id
        })
      ])
    );

  });


});