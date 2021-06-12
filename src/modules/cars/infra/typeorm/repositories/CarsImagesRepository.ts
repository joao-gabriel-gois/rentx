import ICreateCarsImagesDTO from "@modules/cars/DTOs/ICreateCarsImagesDTO";
import IDeleteCarsImagesDTO from "@modules/cars/DTOs/IDeleteCarsImageDTO";
import ICarsImagesRepository from "@modules/cars/repositories/ICarsImagesRepository";
import { getRepository, Repository } from "typeorm";

import CarImage from "../entities/CarImage";

export default class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  };
  
  async create({car_id, image_name}: ICreateCarsImagesDTO): Promise<CarImage> {
    const carImage = this.repository.create({ car_id, image_name });

    await this.repository.save(carImage);

    return carImage;
  };

  async delete({car_id, image_name}: IDeleteCarsImagesDTO): Promise<void> {
    await this.repository.delete({car_id, image_name});
  }

  async findByCarId(car_id: string): Promise<CarImage[]> {
    const carImage = await this.repository.find({ car_id });

    return carImage;
  }

}