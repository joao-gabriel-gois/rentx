import { Router } from 'express';

import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { ListSpecificationsController } from '@modules/cars/useCases/listSpecifications/ListSpecifcationsController';
import ensureAuthentication from '../middlewares/ensureAuthentication';
import checkUserPrivilegeLevel from '../middlewares/checkUserPrivilegeLevel';


const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationsRoutes.get('/', listSpecificationsController.handle);
specificationsRoutes.post(
  '/',
  ensureAuthentication,
  checkUserPrivilegeLevel,
  createSpecificationController.handle
);


export { specificationsRoutes };
