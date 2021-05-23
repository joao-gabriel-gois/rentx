import ICreateCarDTO from '@modules/cars/DTOs/ICreateCarDTO';
import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import CreateCarUseCase from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it('should be able to create new a car', async () => {
    const carRequestData: ICreateCarDTO = {
        name: 'test',
        description: 'test description',
        daily_rate: 100,
        license_plate: 'fake-lincense-plate',
        fine_amount: 60,
        brand: 'Toyota',
        category_id: 'fake-uuid'
    };

    const createdCar = await createCarUseCase.execute(carRequestData);
    
    expect(createdCar).toHaveProperty('id');
    
  });

  it('should not be able to create a car with existing license plate', async () => {
    const carRequestData: ICreateCarDTO = {
      name: 'test',
      description: 'test description',
      daily_rate: 100,
      license_plate: 'fake-lincense-plate',
      fine_amount: 60,
      brand: 'Toyota',
      category_id: 'fake-uuid'
    };

    await createCarUseCase.execute(carRequestData);

    await expect(
      createCarUseCase.execute(carRequestData)
    ).rejects.toEqual(new AppError('This car already exists!'));
  });

});
