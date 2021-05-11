export default interface ICreateRentalDTO {
  id?: string;
  user_id: string;
  car_id: string;
  expected_return_date: Date;
  total?: number;
  end_date?: Date;
}