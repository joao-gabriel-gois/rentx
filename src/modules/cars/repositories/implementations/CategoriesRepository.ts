import Category from '../../entities/Category';
import ICreateCategoryDTO from '.././DTOs/ICreateCategoryDTO';
import ICategoriesRepository from '../ICategoriesRepository';

import { getRepository, Repository } from 'typeorm';

export default class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor () {
    this.repository = getRepository(Category);
  }
// Singleton {
  private static INSTANCE: CategoriesRepository;
  
  public static getInstance(): CategoriesRepository {
    if(!CategoriesRepository.INSTANCE) {
      CategoriesRepository.INSTANCE = new CategoriesRepository();
    }
    
    return CategoriesRepository.INSTANCE;
  }
  // }
  
  create({name, description}: ICreateCategoryDTO): Category {  
    const category = this.repository.create({
      name,
      description,
    });
    
    return category;
  }
  
  
  async list(): Promise<Category[]> {
    const categories = await this.repository.find();
    
    return categories;
  }
  
  async findByName(name: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({ name });
    
    return category;
  }

  async save(category: Category): Promise<void> {
    await this.repository.save(category);
  }
  
}
