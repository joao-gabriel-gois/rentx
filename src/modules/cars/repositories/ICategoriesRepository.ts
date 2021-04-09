import Category from "../entities/Category";
import ICreateCategoryDTO from "../DTOs/ICreateCategoryDTO";

export default interface ICategoriesRepository {
  create({name, description}: ICreateCategoryDTO): Promise<void>;
  list(): Promise<Category[]>;
  findByName(name: string): Promise<Category | undefined>;
}
