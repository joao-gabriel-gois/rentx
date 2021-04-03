import { Router } from 'express';
import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes   gi} from './specifications.routes';


const routes = Router();

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);

export default routes;
