import ICarsImagesRepository from "@modules/cars/repositories/ICarsImagesRepository";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  images_names: string[];
};

@injectable()
export default class UploadCarImagesUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository
  ) {};

  async execute({ car_id, images_names}: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);
    
    if (!car) {
      throw new AppError('Car does not exists', 404);
    }

    images_names.map(async (image_name) => {
      return await this.carsImagesRepository.create({ car_id, image_name });
    });
  }

};
