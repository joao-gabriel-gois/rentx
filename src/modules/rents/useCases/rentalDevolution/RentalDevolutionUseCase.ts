import ICarsRepository from "@modules/cars/repositories/ICarsRepository";
import Rental from "@modules/rents/infra/typeorm/entities/Rental";
import IRentsRepository from "@modules/rents/repositories/IRentsRepository";
import IDateProvider from "@shared/container/providers/DateProvider/IDateProvider";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
export default class DevolutionRentalUseCase {
  constructor(
    @inject('RentsRepository')
    private rentsRepository: IRentsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {};

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const minimumRentalPeriod = 1;
    const dateNow = this.dateProvider.dateNow();
    const rental = await this.rentsRepository.findById(id);
    
    if (!rental) {
      throw new AppError('Rental does not exists!');
    }
    
    const car = await this.carsRepository.findById(rental!.car_id);

    if (!car) {
      throw new AppError('Car does not exists!');
    }

    let daysRented = this.dateProvider.comparisonResultInDays(rental.start_date, dateNow);

    if (daysRented <= 0) {
      daysRented = minimumRentalPeriod;
    }

    const lateReturnDelayInDays = this.dateProvider.comparisonResultInDays(dateNow, rental.expected_return_date);

    console.log(`\nDays Rented: ${daysRented}, Late Return Delay: ${lateReturnDelayInDays}\n`);

    let total = 0;
    
    if (lateReturnDelayInDays > 0) {
      const finalFine = lateReturnDelayInDays * car!.fine_amount;
      total = finalFine;
    }

    total += daysRented * car.daily_rate;
    console.log('\nTOTAL:', total);

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentsRepository.createOrUpdate(rental);

    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  };
}
