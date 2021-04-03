import { Router } from 'express';
import { categoriesRoutes } from './categoriesRoutes';

const routes = Router();

routes.use('/categories', categoriesRoutes);

export default routes;