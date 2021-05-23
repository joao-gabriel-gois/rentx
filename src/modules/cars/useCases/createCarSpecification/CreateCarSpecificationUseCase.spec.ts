import CreateCarSpecificationUseCase from '../createCarSpecification/CreateCarSpecificationUseCase';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import SpecificationsRepositoryInMemory from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepository: ICarsRepository;
let specificationsRepository: ISpecificationsRepository;

beforeEach(() => {
  carsRepository = new CarsRepositoryInMemory();
  specificationsRepository = new SpecificationsRepositoryInMemory();
  createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
    carsRepository,
    specificationsRepository
  );
});

describe('Crate Specification', () => {
  it('should be able to create a new specification for an existing car', async () => {
    const car = await carsRepository.create({
      name: 'Test Car',
      description: 'Description for test car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category'
    });

    const specification = await specificationsRepository.create({
      name: 'Specification Test',
      description: 'Unit Test for Car Specification UseCase'
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });

  it('should not be able to create a car specifications for non-existing cars', async () => {
    const car_id = '1234';
    const specifications_id = ['54321'];
    
    await expect(
      createCarSpecificationUseCase.execute({car_id, specifications_id})
    ).rejects.toEqual(new AppError('Car does not exists!'));
  });

});
