import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';

import checkUserPrivilegeLevel from '../middlewares/checkUserPrivilegeLevel';
import ensureAuthentication from '../middlewares/ensureAuthentication';

import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';


const carsRoutes = Router();

const createCarController = new CreateCarController();
const createCarSpecificationController = new CreateCarSpecificationController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRoutes.post('/', ensureAuthentication, checkUserPrivilegeLevel, createCarController.handle);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthentication,
  checkUserPrivilegeLevel,
  createCarSpecificationController.handle
);

export { carsRoutes };
