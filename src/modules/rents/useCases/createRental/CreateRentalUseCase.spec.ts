import dayjs from 'dayjs';

import RentsRepositoryInMemory from '@modules/rents/infra/typeorm/repositories/in-memory/RentsRepositoryInMemory';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import CreateRentalUseCase from '@modules/rents/useCases/createRental/CreateRentalUseCase';
import AppError from '@shared/errors/AppError';


let createRentalUseCase: CreateRentalUseCase;
let rentsRepository: IRentsRepository;

describe("Create Rental", () => {
  const tomorrowDate = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentsRepository = new RentsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentsRepository);
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: 'any-user-id',
      car_id: 'any-car-id',
      expected_return_date: tomorrowDate,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open rental for this car', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any-user-id',
        car_id: 'any-car-id',
        expected_return_date: tomorrowDate,
      });

      await createRentalUseCase.execute({
        user_id: 'any-other-user-id',
        car_id: 'any-car-id',
        expected_return_date: tomorrowDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open rental for this same user', () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'any-user-id',
        car_id: 'any-car-id',
        expected_return_date: tomorrowDate,
      });

      await createRentalUseCase.execute({
        user_id: 'any-user-id',
        car_id: 'any-other-car-id',
        expected_return_date: tomorrowDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if duration lesser than 24 hours', () => {
    expect(async () => {
      const sixHoursFromNow = dayjs().add(6, 'hours').toDate();

      await createRentalUseCase.execute({
        user_id: 'any-user-id',
        car_id: 'any-car-id',
        expected_return_date: sixHoursFromNow,
      });

    }).rejects.toBeInstanceOf(AppError);
  });
});