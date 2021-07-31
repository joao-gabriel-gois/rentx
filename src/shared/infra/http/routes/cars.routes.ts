import { Router } from 'express';
import multer from 'multer';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import checkUserPrivilegeLevel from '../middlewares/checkUserPrivilegeLevel';
import ensureAuthentication from '../middlewares/ensureAuthentication';

import uploadConfig from '@config/upload';
import { DeleteCarImageController } from '@modules/cars/useCases/deleteCarImage/DeleteCarImageController';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const createCarSpecificationController = new CreateCarSpecificationController();
const listAvailableCarsController = new ListAvailableCarsController();
const uploadCarImagesController = new UploadCarImagesController();
const deleteCarImageController = new DeleteCarImageController();

const uploadCarImages = multer(uploadConfig);


carsRoutes.post('/', ensureAuthentication, checkUserPrivilegeLevel, createCarController.handle);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthentication,
  checkUserPrivilegeLevel,
  createCarSpecificationController.handle
);

carsRoutes.post(
  '/images/:id',
  ensureAuthentication,
  checkUserPrivilegeLevel,
  uploadCarImages.array('images'),
  uploadCarImagesController.handle
)

carsRoutes.delete(
  '/images/:id',
  ensureAuthentication,
  checkUserPrivilegeLevel,
  deleteCarImageController.handle
)

export { carsRoutes };
