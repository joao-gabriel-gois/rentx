import { inject, injectable } from "tsyringe";
import ICreateCarDTO from "@modules/cars/DTOs/ICreateCarDTO";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import AppError from "@shared/errors/AppError";
import Car from "@modules/cars/infra/typeorm/entities/Car";

interface IRequest extends ICreateCarDTO {};

@injectable()
export default class CreateCarUseCase {
  constructor(
   @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {};

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: IRequest): Promise<Car> {

    const hasThisCar = await this.carsRepository.findByLicensePlate(license_plate);

    if (hasThisCar) {
      throw new AppError('This car already exists!');
    }
    
    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    return car;
  }
}
