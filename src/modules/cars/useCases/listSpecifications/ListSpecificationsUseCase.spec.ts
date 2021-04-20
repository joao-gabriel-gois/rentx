
import AppError from '@shared/errors/AppError';
import CreateCategoryUseCase from '@modules/cars/useCases/createCategory/CreateCategoryUseCase';
import ListSpecificationsUseCase from './ListSpecificationsUseCase';
import CreateSpecificationUseCase from '../createSpecification/CreateSpecificationUseCase';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import SpecificationsRepositoryInMemory from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import ICreateSpecificationDTO from '@modules/cars/DTOs/ICreateSpecificationDTO';

let listSpecifications: ListSpecificationsUseCase;
let createSpecification: CreateSpecificationUseCase;
let specificationsRepository: ISpecificationsRepository;

beforeEach(() => {
  specificationsRepository = new SpecificationsRepositoryInMemory();
  createSpecification = new CreateSpecificationUseCase(specificationsRepository);
  listSpecifications = new ListSpecificationsUseCase(specificationsRepository);
});

describe('List Specifications', () => {
  it('It should list all specifications', async () => {
    let testNumber = 0;
    const specificationsArray = [];
    const getSpecificationRequestData = (): ICreateSpecificationDTO => {
      return {
        name: `Test ${++testNumber}`,
        description: 'testing',
      };
    };

    for (let i = 0; i <= 5; i++) {
      const specificationRequestData = getSpecificationRequestData();
      await createSpecification.execute(specificationRequestData);
      
      const specification = await specificationsRepository.findByName(specificationRequestData.name);

      specificationsArray.push(specification);
    }

    const listedSpecification = await listSpecifications.execute();

    expect(listedSpecification).toEqual(specificationsArray);
  });
});
