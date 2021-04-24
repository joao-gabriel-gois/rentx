import ICreateCarDTO from "@modules/cars/DTOs/ICreateCarDTO";
import Car from "@modules/cars/infra/typeorm/entities/Car";
import CarsRepository from "@modules/cars/infra/typeorm/repositories/CarsRepository";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import CarsRepositoryInMemory from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import CreateCarUseCase from "../createCar/CreateCarUseCase";
import ListAvailableCarsUseCase from "./ListAvailableCarsUseCase";

const getCarRequestData = (testNumber: number, brand = 'Toyota'): ICreateCarDTO => {
  return {
    name: `Test ${testNumber}`,
    description: `Test ${testNumber} description`,
    daily_rate: 100,
    license_plate: `${testNumber * (Math.random() * 1000)}`,
    fine_amount: 60,
    brand,
    category_id: `fake-uuid-${testNumber}`
  };
};


const getRandomBrand = () => {
  const randomIndex = Math.floor(Math.random() * 10 / 2);
  const brandsArray = ['Volkswagen', 'Chevrolet', 'Audi', 'Citroen', 'Fiat'];

  return brandsArray[randomIndex];
}

// brand and name filters are broken

let carsArray: Car[];
let testNumber: number;

let carsRepository: ICarsRepository;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
    createCarUseCase = new CreateCarUseCase(carsRepository)

    carsArray = [];
    testNumber = 0;
  });

  it('should be able to list all available cars', async () => {
    for (let i = 0; i <= 5; i++) {
      const carRequestData = getCarRequestData(i + 1);
      await createCarUseCase.execute(carRequestData);
      
      const car = await carsRepository.findByLicensePlate(carRequestData.license_plate);
      carsArray.push(car!);
    }
    
    const listedCars = await listAvailableCarsUseCase.execute();

    expect(listedCars).toEqual(carsArray);
  });


  it('should be able to list all avaialble cars from a certain brand', async () => {
    let lastRandomBrand: string;

    for (let i = 0; i <= 5; i++) {
      const carRequestData = getCarRequestData(i + 1, getRandomBrand());
      await createCarUseCase.execute(carRequestData);
      
      const car = await carsRepository.findByLicensePlate(carRequestData.license_plate);
      carsArray.push(car!);

      if (i === 5) lastRandomBrand = carRequestData.brand;  
    }
    
    const listedCars = await listAvailableCarsUseCase.execute({
      brand: lastRandomBrand!
    });

    expect(listedCars).toEqual(carsArray.filter(car => car.brand === lastRandomBrand));
  });

  it('should be able to list all avaialble cars filtering by category_id', async () => {
    let lastCategoryId: string;

    for (let i = 0; i <= 5; i++) {
      const carRequestData = getCarRequestData(i + 1, getRandomBrand());
      await createCarUseCase.execute(carRequestData);
      
      const car = await carsRepository.findByLicensePlate(carRequestData.license_plate);
      carsArray.push(car!);

      if (i === 5) lastCategoryId = carRequestData.category_id;  
    }
    
    const listedCars = await listAvailableCarsUseCase.execute({
      category_id: lastCategoryId!
    });

    expect(listedCars).toEqual(carsArray.filter(car => car.category_id === lastCategoryId));
  });

  it('should be able to list all avaialble filtering by name', async () => {
    let lastNameAdded: string;

    for (let i = 0; i <= 5; i++) {
      const carRequestData = getCarRequestData(i + 1, getRandomBrand());
      await createCarUseCase.execute(carRequestData);
      
      const car = await carsRepository.findByLicensePlate(carRequestData.license_plate);
      carsArray.push(car!);

      if (i === 5) lastNameAdded = carRequestData.name;  
    }
    
    const listedCars = await listAvailableCarsUseCase.execute({
      name: lastNameAdded!
    });

    expect(listedCars).toEqual(carsArray.filter(car => car.name === lastNameAdded));
  });

});
