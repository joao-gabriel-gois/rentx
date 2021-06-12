import ICreateCarsImagesDTO from '@modules/cars/DTOs/ICreateCarsImagesDTO';
import IDeleteCarsImageDTO from '@modules/cars/DTOs/IDeleteCarsImageDTO';

import ICarsImagesRepository from '../ICarsImagesRepository';

import CarImage from '@modules/cars/infra/typeorm/entities/CarImage';


export default class CarsImagesRepositoryInMemory implements ICarsImagesRepository {
  private carsImagesRepository: CarImage[];

  constructor() {
    this.carsImagesRepository = [];
  }

  async create({ car_id, image_name }: ICreateCarsImagesDTO): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      car_id,
      image_name
    });

    this.carsImagesRepository.push(carImage);

    return carImage;
  }

  async delete({ car_id, image_name }: IDeleteCarsImageDTO): Promise<void> {
    const carImageIndex = this.carsImagesRepository.findIndex(carImage => (
      carImage.car_id === car_id && carImage.image_name === image_name
    ));

    this.carsImagesRepository.splice(carImageIndex, 1);
  }

  async findByCarId(car_id: string): Promise<CarImage[]> {
    return this.carsImagesRepository.filter(
      carImage => carImage.car_id === car_id
    );
  }
    
}