import AppError from "../../../../error/AppError";
import ICategoriesRepository from "../../repositories/ICategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

export default class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {};

  async execute({name, description}: IRequest): Promise<void> {
    const hasThisCategory = await this.categoriesRepository.findByName(name);
  
    if (hasThisCategory) {
      throw new AppError('Category Already Exists!');
    }

    const category = this.categoriesRepository.create({ name, description });

    await this.categoriesRepository.save(category);
  }
}