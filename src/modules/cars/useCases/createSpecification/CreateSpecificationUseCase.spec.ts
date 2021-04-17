
import AppError from '@errors/AppError';
import ICreateSpecificationDTO from '@modules/cars/DTOs/ICreateSpecificationDTO';
import SpecificationsRepositoryInMemory from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import CreateSpecificationUseCase from './CreateSpecificationUseCase';


let createSpecitifcation: CreateSpecificationUseCase;
let specificationsRepository: ISpecificationsRepository;

beforeEach(() => {
  specificationsRepository = new SpecificationsRepositoryInMemory();
  createSpecitifcation = new CreateSpecificationUseCase(specificationsRepository);
});

describe('Create Specitifcation', () => {
  it('It should create a new Specitifcation', async () => {
    const specificationRequestData: ICreateSpecificationDTO = {
      name: 'test',
      description: 'testing',
    };

    await createSpecitifcation.execute(specificationRequestData);

    const specification = await specificationsRepository.findByName(specificationRequestData.name);
    
    expect(specification).toHaveProperty('id');
    expect(specification).toEqual(
      expect.objectContaining(specificationRequestData)
    );
  });

  it('should not be able to duplicate a category', async () => {
    expect(async () => {
      const specificationRequestData: ICreateSpecificationDTO = {
        name: 'test',
        description: 'testing',
      };
  
      await createSpecitifcation.execute(specificationRequestData);
      await createSpecitifcation.execute(specificationRequestData);
    })
    .rejects.toBeInstanceOf(AppError);
  });

});
