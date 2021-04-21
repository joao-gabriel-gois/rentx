import ICreateCarDTO from '@modules/cars/DTOs/ICreateCarDTO';
import Car from '@modules/cars/infra/typeorm/entities/Car';
import ICarsRepository from '../ICarsRepository';


export default class CarsRepositoryInMemory implements ICarsRepository {
  private carsRepository: Car[];

  constructor() {
    this.carsRepository = [];
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    
    Object.assign(car, data);
    
    this.carsRepository.push(car);

    return car;
  }
  
  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = this.carsRepository.find(car => car,license_plate === license_plate);

    return new Promise((resolve, reject) => {
      resolve(car);
    })
  }
  
}