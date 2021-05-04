import { Router } from 'express';
import { authenticationsRoutes } from './authentications.routes';

import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';
import { carsRoutes } from './cars.routes';
import { rentsRoutes } from './rentes.routes';

const routes = Router();

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/users', usersRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rents', rentsRoutes);
routes.use(authenticationsRoutes);

export default routes;
