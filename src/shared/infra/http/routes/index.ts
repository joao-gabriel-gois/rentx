import { Router } from 'express';

import { authenticationsRoutes } from './authentications.routes';
import { categoriesRoutes } from './categories.routes';
import { passwordRoutes } from './password.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';
import { carsRoutes } from './cars.routes';
import { rentsRoutes } from './rents.routes';

const routes = Router();

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/users', usersRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rents', rentsRoutes);
routes.use('/password', passwordRoutes);
routes.use(authenticationsRoutes);

export default routes;
