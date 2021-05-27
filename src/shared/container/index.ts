import { container } from 'tsyringe';

import '@shared/container/providers';

import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import IRentsRepository from '@modules/rents/repositories/IRentsRepository';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IUsersTokensRepository from '@modules/accounts/repositories/IUsersTokensRepository';

import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import CategoriesRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import RentsRepository from '@modules/rents/infra/typeorm/repositories/RentsRepository';
import SpecificationsRepository from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import UsersRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import UsersTokensRepository from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository
);

container.registerSingleton<ICarsRepository>(
  'CarsRepository',
  CarsRepository
);

container.registerSingleton<ICarsImagesRepository>(
  'CarsImagesRepository',
  CarsImagesRepository
);

container.registerSingleton<IRentsRepository>(
  'RentsRepository',
  RentsRepository
);

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository
);
