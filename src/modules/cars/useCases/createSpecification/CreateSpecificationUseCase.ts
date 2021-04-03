import AppError from "../../../../error/AppError";
import ISpecificationsRepository from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

export default class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {};
  
  execute({name, description}: IRequest): void {
    const hasThisSpecification = this.specificationsRepository.findByName(name);

    if (hasThisSpecification) {
      throw new AppError('Specification already exists!');
    }

    this.specificationsRepository.create({name, description});
  }
}