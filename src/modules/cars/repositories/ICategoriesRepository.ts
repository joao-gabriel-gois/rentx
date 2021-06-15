
import ICreateCategoryDTO from '../DTOs/ICreateCategoryDTO';
import Category from '../infra/typeorm/entities/Category';

export default interface ICategoriesRepository {
  create({name, description}: ICreateCategoryDTO): Promise<void>;
  list(): Promise<Category[]>;
  findByName(name: string): Promise<Category | undefined>;
}
