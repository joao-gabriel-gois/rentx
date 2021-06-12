import ICreateCarsImagesDTO from "../DTOs/ICreateCarsImagesDTO";
import IDeleteCarsImagesDTO from "../DTOs/IDeleteCarsImageDTO";
import CarImage from "../infra/typeorm/entities/CarImage";

export default interface ICarsImagesRepository {
  create({car_id, image_name}: ICreateCarsImagesDTO): Promise<CarImage>;
  delete({car_id, image_name}: IDeleteCarsImagesDTO): Promise<void>;
  findByCarId(car_id: string): Promise<CarImage[]>;
};