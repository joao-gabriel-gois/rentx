import ICreateCategoryDTO from '@modules/cars/DTOs/ICreateCategoryDTO';
import Category from '@modules/cars/infra/typeorm/entities/Category';
import ICategoriesRepository from '../ICategoriesRepository';

export default class CategoriesRepositoryInMemory implements ICategoriesRepository {
  private categoriesRepository: Category[];

  constructor() {
    this.categoriesRepository = [];
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
    });

    this.categoriesRepository.push(category);
  }

  async list(): Promise<Category[]> {
     return this.categoriesRepository;
  }

  async findByName(name: string): Promise<Category | undefined> {
    const category = this.categoriesRepository.find(category => category.name === name);

    return category;
  }

}
