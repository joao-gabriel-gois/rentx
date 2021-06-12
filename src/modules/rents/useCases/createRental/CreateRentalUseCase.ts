import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICreateRentalDTO from '@modules/rents/DTOs/ICreateRentalDTO';
import Rental from '@modules/rents/infra/typeorm/entities/Rental';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest extends ICreateRentalDTO {};

@injectable()
export default class CreateRentalUseCase {
  constructor(
    @inject('RentsRepository')
    private rentsRepository: IRentsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {};

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
    const dateNow = this.dateProvider.dateNow();
    const comparison = this.dateProvider.comparisonResultInHours(dateNow, expected_return_date);

    if (comparison < rentalMinimumExpirationTimeInHours) {
      throw new AppError('Invalid expected return date, minimum rental expiration is 24 hours');
    }

    const rental = await this.rentsRepository.createOrUpdate({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability(car_id, false);

    return rental;
    
  }

}