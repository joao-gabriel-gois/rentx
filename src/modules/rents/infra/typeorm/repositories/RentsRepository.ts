import ICreateRentalDTO from "@modules/rents/DTOs/ICreateRentalDTO";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import { getRepository, Repository } from "typeorm";
import Rental from "../entities/Rental";

class RentsRepository implements IRentsRepository {
  private rentsRepository: Repository<Rental>;

  constructor() {
    this.rentsRepository = getRepository(Rental);
  }
  
  async createOrUpdate(data: ICreateRentalDTO): Promise<Rental> {
    const rental = this.rentsRepository.create(data);
    
    await this.rentsRepository.save(rental);
    
    return rental;
  }

  findById(rental_id: string): Promise<Rental | undefined> {
    const rental = this.rentsRepository.findOne(rental_id);

    return rental;
  }
  
  async findOpenRentalByCarId(car_id: string): Promise<Rental | undefined> {
    return await this.rentsRepository.findOne({
      where: {
        car_id,
        end_date: null
      }
    });
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental | undefined> {
    return await this.rentsRepository.findOne({
      where: {
        user_id,
        end_date: null
      }
    });
  }

  async findAllByUserId(user_id: string): Promise<Rental[]> {
    return await this.rentsRepository.find({
      where: { user_id },
      relations: ['car']
    });
  }

}

export default RentsRepository;