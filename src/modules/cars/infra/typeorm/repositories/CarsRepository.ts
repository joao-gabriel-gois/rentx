import ICreateCarDTO from "@modules/cars/DTOs/ICreateCarDTO";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import Car from "../entities/Car";



export default class CarsRepository implements ICarsRepository {

  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }
  
  async create(data: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create(data);

    await this.repository.save(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = await this.repository.findOne({
      license_plate,
    });

    return car;
  }

}
