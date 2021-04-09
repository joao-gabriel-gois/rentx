import Category from '../../entities/Category';
import ICreateCategoryDTO from '../../DTOs/ICreateCategoryDTO';
import ICategoriesRepository from '../ICategoriesRepository';

import { getRepository, Repository } from 'typeorm';

export default class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }
    
  async create({name, description}: ICreateCategoryDTO): Promise<void> {  
    const category = this.repository.create({
      name,
      description,
    });

    await this.repository.save(category);
  }
  
  async list(): Promise<Category[]> {
    const categories = await this.repository.find();
    
    return categories;
  }
  
  async findByName(name: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({ name });
    
    return category;
  }
  
}
