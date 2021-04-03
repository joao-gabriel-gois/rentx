import Category from "../models/Category";
import ICreateCategoryDTO from "./DTOs/ICreateCategoryDTO";

export default interface ICategoriesRepository {
  create({name, description}: ICreateCategoryDTO): void;
  list(): Category[];
  findByName(name: string): Category | undefined;
}
