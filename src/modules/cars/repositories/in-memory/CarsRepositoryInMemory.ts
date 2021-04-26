import ICreateCarDTO from '@modules/cars/DTOs/ICreateCarDTO';
import IListAvailableCarsDTO from '@modules/cars/DTOs/IListAvailableCarsDTO';
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
  
  async findById(id: string): Promise<Car | undefined> {
    const car = this.carsRepository.find(car => car.id === id);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | undefined> {
    const car = this.carsRepository.find(car => car.license_plate === license_plate);

    return car;
  }

  async findAvailableCars(data?: IListAvailableCarsDTO): Promise<Car[]> {
    let cars;

    if (data) {
      cars = this.carsRepository.filter(car => {
        if (
            car.available &&
            (data?.name && car.name === data?.name) ||
            (data?.brand && car.brand === data?.brand) ||
            (data?.category_id && car.category_id === data?.category_id)
        ) {
          return car;
        }
        return null;
      });
    }
    else {
      cars = this.carsRepository.filter(car => car.available === true);
    }

    return cars;
  }

}