import Specification from "../../entities/Specification";
import ISpecificationsRepository from "../../repositories/ISpecificationsRepository";

export default class ListSpecificationsUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {};

  async execute(): Promise<Specification[]> {
    const specifications = await this.specificationsRepository.list();

    return specifications;
  }
}
