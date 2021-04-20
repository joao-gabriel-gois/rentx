
import AppError from '@shared/errors/AppError';
import ICreateCategoryDTO from '@modules/cars/DTOs/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import CategoriesRepositoryInMemory from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import CreateCategoryUseCase from '@modules/cars/useCases/createCategory/CreateCategoryUseCase';
import ListCategoriesUseCase from './ListCategoriesUseCase';

let listCategories: ListCategoriesUseCase;
let createCategory: CreateCategoryUseCase;
let categoriesRepository: ICategoriesRepository;

beforeEach(() => {
  categoriesRepository = new CategoriesRepositoryInMemory();
  createCategory = new CreateCategoryUseCase(categoriesRepository);
  listCategories = new ListCategoriesUseCase(categoriesRepository);
});

describe('List Categories', () => {
  it('It should list all categories', async () => {
    let testNumber = 0;
    const categoriesArray = [];
    const getCategoryRequestData = (): ICreateCategoryDTO => {
      return {
        name: `Test ${++testNumber}`,
        description: 'testing',
      };
    };

    for (let i = 0; i <= 5; i++) {
      const categoryRequestData = getCategoryRequestData();
      await createCategory.execute(categoryRequestData);
      
      const category = await categoriesRepository.findByName(categoryRequestData.name);

      categoriesArray.push(category);
    }

    const listedCategories = await listCategories.execute();

    expect(listedCategories).toEqual(categoriesArray);
  });
});
