import AppError from "../error/AppError";
import CategoriesRepository from "../repositories/CategoriesRepository";


interface IRequest {
  name: string;
  description: string;
}

export default class CreateCategoryService {
  private categoriesRepository;

  constructor(categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  execute({name, description}: IRequest): void {
    const hasThisCategory = this.categoriesRepository.findByName(name);
  
    if (hasThisCategory) {
      throw new AppError('Category Already Exists!');
    }

    this.categoriesRepository.create({ name, description });
  }
}