import ICreateRentalDTO from "../DTOs/ICreateRentalDTO";
import Rental from "../infra/typeorm/entities/Rental";

export default interface IRentsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>,
  findOpenRentalByCarId(car_id: string): Promise<Rental | undefined>,
  findOpenRentalByUserId(user_id: string): Promise<Rental | undefined>
}