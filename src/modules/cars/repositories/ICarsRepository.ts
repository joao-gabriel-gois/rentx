import ICreateCarDTO from "../DTOs/ICreateCarDTO";
import IListAvailableCarsDTO from "../DTOs/IListAvailableCarsDTO";
import Car from "../infra/typeorm/entities/Car";


export default interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findById(id: string): Promise<Car | undefined>;
  findByLicensePlate(license_plate: string): Promise<Car | undefined>;
  findAvailableCars(data?: IListAvailableCarsDTO): Promise<Car[]>;
}
