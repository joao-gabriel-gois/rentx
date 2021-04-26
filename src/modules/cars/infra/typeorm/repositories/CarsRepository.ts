import ICreateCarDTO from "@modules/cars/DTOs/ICreateCarDTO";
import IListAvailableCarsDTO from "@modules/cars/DTOs/IListAvailableCarsDTO";
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
  
  async findById(id: string): Promise<Car | undefined> {
    return await this.repository.findOne(id);
  }

  async findAvailableCars({ name, brand, category_id }: IListAvailableCarsDTO = {}): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder('car')
      .where('available = :available', { available: true});

    if (name) {
      carsQuery.andWhere('name = :name', { name });
    }
      
    if (brand) {
      carsQuery.andWhere('brand = :brand', { brand });
    }

    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', { category_id });
    }

    const cars = await carsQuery.getMany();

    // My previous approach, check if it works later:
    // const cars = await this.repository.find({
    //   where: {
    //     available: true,
    //     ...data
    //   }
    // });
    return cars;
  }

}
