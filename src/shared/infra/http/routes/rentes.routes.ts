import { CreateRentalController } from '@modules/rents/useCases/createRental/CreateRentalController';
import { Router } from 'express';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const rentsRoutes = Router();

const createRentalController = new CreateRentalController();

rentsRoutes.post('/', ensureAuthentication, createRentalController.handle);

export { rentsRoutes };
