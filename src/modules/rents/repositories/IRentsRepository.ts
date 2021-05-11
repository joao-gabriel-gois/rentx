import ICreateRentalDTO from "../DTOs/ICreateRentalDTO";
import Rental from "../infra/typeorm/entities/Rental";

export default interface IRentsRepository {
  createOrUpdate(data: ICreateRentalDTO): Promise<Rental>,
  findById(rental_id: string): Promise<Rental | undefined>,
  findOpenRentalByCarId(car_id: string): Promise<Rental | undefined>,
  findOpenRentalByUserId(user_id: string): Promise<Rental | undefined>
  findAllByUserId(user_id: string): Promise<Rental[]>;
}