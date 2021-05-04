import ICreateRentalDTO from "@modules/rents/DTOs/ICreateRentalDTO";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import { getRepository } from "typeorm";
import Rental from "../entities/Rental";

class RentsRepository implements IRentsRepository {
  private rentsRepository: Repository<Rental>;

  constructor() {
    this.rentsRepository = getRepository(Rental);
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = this.rentsRepository.create(data);
    
    await this.rentsRepository.save(rental);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental | undefined> {
    return await this.rentsRepository.findOne({ car_id });
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental | undefined> {
    return await this.rentsRepository.findOne({ user_id });
  }
}

export default RentsRepository;