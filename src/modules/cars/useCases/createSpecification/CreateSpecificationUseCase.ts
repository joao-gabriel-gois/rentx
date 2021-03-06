import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
export default class CreateSpecificationUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {};
  
  async execute({name, description}: IRequest): Promise<void> {
    const hasThisSpecification = await this.specificationsRepository.findByName(name);

    if (hasThisSpecification) {
      throw new AppError('Specification already exists!');
    }

    await this.specificationsRepository.create({name, description});
  }
}