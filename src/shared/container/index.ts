import { container } from 'tsyringe';

import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CategoriesRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import SpecificationsRepository from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import UsersRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';

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

