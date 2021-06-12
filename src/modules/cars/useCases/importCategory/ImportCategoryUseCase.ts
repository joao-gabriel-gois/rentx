import fs from 'fs';
import csvParse from 'csv-parse';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';

interface IImportedCategory {
  name: string;
  description: string;
}

@injectable()
export default class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {};
  
  loadCategories(file: Express.Multer.File): Promise<IImportedCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      console.log(file.path);
      const categories: IImportedCategory[] = [];
      
      const parseFile = csvParse();
  
      stream.pipe(parseFile);
  
      parseFile.on('data', async (line) => {
        const [ name, description ] = line;
  
        categories.push({
          name,
          description,
        });
      }).on('end', () => {
        fs.promises.unlink(file.path);
        resolve(categories);
      }).on('error', (error) => {
        reject(new AppError(error.message));
      });

    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);
    
    categories.forEach(async (category) => {
      const { name, description } = category;

      const hasThisCategory = await this.categoriesRepository.findByName(name);

      if (!hasThisCategory) {
        await this.categoriesRepository.create({
          name,
          description
        });
      }
    });

  }
}