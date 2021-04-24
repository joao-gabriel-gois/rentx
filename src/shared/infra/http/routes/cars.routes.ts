import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import ensureAuthentication from '../middlewares/ensureAuthentication';
import checkUserPrivilegeLevel from '../middlewares/checkUserPrivilegeLevel';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';


const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRoutes.post('/', ensureAuthentication, checkUserPrivilegeLevel, createCarController.handle);

carsRoutes.get('/available', listAvailableCarsController.handle);

export { carsRoutes };
