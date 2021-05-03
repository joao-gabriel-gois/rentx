import ICreateRentalDTO from '@modules/rents/DTOs/ICreateRentalDTO';
import Rental from '@modules/rents/infra/typeorm/entities/Rental';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import AppError from '@shared/errors/AppError';
import dateHandler from '@utils/dateHandler';

dateHandler.set();

interface IRequest extends ICreateRentalDTO {};

export default class CreateRentalUseCase {
  constructor(private rentsRepository: IRentsRepository) {};

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const rentalMinimumExpirationTimeInHours = 24;

    const rentalOpenToCar = await this.rentsRepository.findOpenRentalByCarId(car_id);

    if (rentalOpenToCar) {
      throw new AppError('Car is unavailable!');
    }

    const rentalOpenToUser = await this.rentsRepository.findOpenRentalByUserId(user_id);

    if (rentalOpenToUser) {
      throw new AppError('User has remaining rentals in progress!');
    }

    // The rental must have 24h of minimum duration
    const comparison = dateHandler.comparisonResultInHours(expected_return_date);

    if (comparison < rentalMinimumExpirationTimeInHours) {
      throw new AppError('Invalid expected return date, minimum rental expiration is 24 hours');
    }

    const rental = await this.rentsRepository.create({
      user_id,
      car_id,
      expected_return_date
    });

    return rental;
    
  }

}