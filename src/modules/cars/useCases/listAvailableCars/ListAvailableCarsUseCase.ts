import IListAvailableCarsDTO from "@modules/cars/DTOs/IListAvailableCarsDTO";
import Car from "@modules/cars/infra/typeorm/entities/Car";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";

interface IRequest extends IListAvailableCarsDTO {};

@injectable()
export default class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {};

  async execute(data?: IRequest): Promise<Car[]> {
    const availableCars = await this.carsRepository.findAvailableCars(data);

    return availableCars;
  }
}