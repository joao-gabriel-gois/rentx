import { CreateRentalController } from '@modules/rents/useCases/createRental/CreateRentalController';
import { ListRentsByUserController } from '@modules/rents/useCases/listRentalByUser/ListRentsByUserController';
import { RentalDevolutionController } from '@modules/rents/useCases/rentalDevolution/RentalDevolutionController';
import { Router } from 'express';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const rentsRoutes = Router();

const createRentalController = new CreateRentalController();
const rentalDevolutionController = new RentalDevolutionController();
const listRentsByUserController = new ListRentsByUserController();

rentsRoutes.use(ensureAuthentication);

rentsRoutes.post('/', createRentalController.handle);
rentsRoutes.post('/devolution/:id', rentalDevolutionController.handle);

rentsRoutes.get('/user', listRentsByUserController.handle);

export { rentsRoutes };
