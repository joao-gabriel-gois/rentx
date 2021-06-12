

import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import CategoriesRepositoryInMemory from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import { createFile } from '@utils/file';
import ImportCategoryUseCase from './ImportCategoryUseCase';

let categoriesRepository: ICategoriesRepository;
let importCategoryUseCase: ImportCategoryUseCase;

describe('Import Categories ', () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    importCategoryUseCase = new ImportCategoryUseCase(categoriesRepository);
  });

  it('should be able to upload car images', async () => {
    const file = createFile({
      folder: '',//tmp
      filename: 'categories',
      extension: 'csv',
      content: 'Sedan,De Tiozão\nHatch,Compacto\nSUV,Bagagem',
    });

    await importCategoryUseCase.execute(file);

    const registeredCategories = await categoriesRepository.list();
    
    expect(registeredCategories.length).toBe(3);

    expect(registeredCategories).toEqual([
      expect.objectContaining({
        name: 'Sedan',
        description: 'De Tiozão' 
      }),
      expect.objectContaining({
        name: 'Hatch',
        description: 'Compacto' 
      }),
      expect.objectContaining({
        name: 'SUV',
        description: 'Bagagem' 
      })
    ]);

    registeredCategories.forEach(category => {
      expect(category).toHaveProperty('id')
    });

  });

  it('should not be able to upload images for a non existing car', async () => {
    // await expect(

    // ).rejects.toEqual(new AppError('Car does not exists!', 404));
  });

});
