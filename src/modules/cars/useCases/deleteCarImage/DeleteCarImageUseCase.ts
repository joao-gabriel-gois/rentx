import { inject, injectable } from "tsyringe";
import { resolve } from 'path';

import IDeleteCarsImagesDTO from "@modules/cars/DTOs/IDeleteCarsImageDTO";
import ICarsImagesRepository from "@modules/cars/repositories/ICarsImagesRepository";
import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import AppError from "@shared/errors/AppError";
import uploadConfig from '@config/upload'
import { deleteFile } from "@utils/file";

@injectable()
export default class DeleteCarImageUseCase {
  
  constructor (
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository
  ) {};
  
  async execute({car_id, image_name}: IDeleteCarsImagesDTO): Promise<void> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car does not exists!', 404);
    }
    const carsImagesPath = uploadConfig('cars').path;

    const filePath = resolve(carsImagesPath, image_name);
    await deleteFile(filePath);
    
    await this.carsImagesRepository.delete({car_id, image_name});
    
  }
}