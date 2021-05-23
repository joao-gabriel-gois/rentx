
import AppError from '@shared/errors/AppError';
import ICreateCategoryDTO from '@modules/cars/DTOs/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import CategoriesRepositoryInMemory from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import CreateCategoryUseCase from './CreateCategoryUseCase';

let createCategory: CreateCategoryUseCase;
let categoriesRepository: ICategoriesRepository;

beforeEach(() => {
  categoriesRepository = new CategoriesRepositoryInMemory();
  createCategory = new CreateCategoryUseCase(categoriesRepository);
});

describe('Create Category', () => {
  it('It should create a new category', async () => {
    const categoryRequestData: ICreateCategoryDTO = {
      name: 'test',
      description: 'testing',
    };

    await createCategory.execute(categoryRequestData);

    const category = await categoriesRepository.findByName(categoryRequestData.name);
    
    expect(category).toHaveProperty('id');
    expect(category).toEqual(
      expect.objectContaining(categoryRequestData)
    );
  });

  
  it('should not be able to duplicate a category', async () => {
    const categoryRequestData: ICreateCategoryDTO = {
      name: 'test',
      description: 'testing',
    };
  
    await createCategory.execute(categoryRequestData);

    await expect(
      // duplicating category bellow
      createCategory.execute(categoryRequestData)
    ).rejects.toEqual(new AppError('Category Already Exists!'));
  });

});
