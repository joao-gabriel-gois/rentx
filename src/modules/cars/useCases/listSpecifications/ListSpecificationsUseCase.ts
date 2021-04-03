import Specification from "../../models/Specification";
import ISpecificationsRepository from "../../repositories/ISpecificationsRepository";

export default class ListSpecificationsUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {};

  execute(): Specification[] {
    const specifications = this.specificationsRepository.list();

    return specifications;
  }
}
