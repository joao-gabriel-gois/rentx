import AppError from "../../../../error/AppError";
import ISpecificationsRepository from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

export default class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {};
  
  async execute({name, description}: IRequest): Promise<void> {
    const hasThisSpecification = await this.specificationsRepository.findByName(name);

    if (hasThisSpecification) {
      throw new AppError('Specification already exists!');
    }

    const specification = await this.specificationsRepository.create({name, description});

    await this.specificationsRepository.save(specification);
  }
}