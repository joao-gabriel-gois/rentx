import Category from "../entities/Category";
import ICreateCategoryDTO from "./DTOs/ICreateCategoryDTO";

export default interface ICategoriesRepository {
  create({name, description}: ICreateCategoryDTO): Category;
  list(): Promise<Category[]>;
  findByName(name: string): Promise<Category | undefined>;
  save(category: Category): Promise<void>;
}
