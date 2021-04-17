import { inject, injectable } from 'tsyringe';

import AppError from '@errors/AppError';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
export default class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {};

  async execute({name, description}: IRequest): Promise<void> {
    const hasThisCategory = await this.categoriesRepository.findByName(name);
  
    if (hasThisCategory) {
      throw new AppError('Category Already Exists!');
    }

    await this.categoriesRepository.create({ name, description });
  }
}