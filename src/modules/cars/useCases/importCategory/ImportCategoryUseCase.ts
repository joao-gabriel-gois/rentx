import fs from 'fs';
import csvParse from 'csv-parse';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

interface IImportedCategory {
  name: string;
  description: string;
}

export default class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {};
  
  loadCategories(file: Express.Multer.File): Promise<IImportedCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
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
        resolve(categories);
      }).on('error', (error) => {
        reject(error);
      });

    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);
    

    categories.forEach((category) => {
      const { name, description } = category;

      const hasThisCategory = this.categoriesRepository.findByName(name);

      if (!hasThisCategory) {
        this.categoriesRepository.create({
          name,
          description
        });
      }
    });

  }
}