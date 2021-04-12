import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import { CreateCategoryController } from '../modules/cars/useCases/createCategory/CreateCategoryController';
import { ListCategoriesController } from '../modules/cars/useCases/listCategories/ListCategoriesController';
import { ImportCategoryController } from '../modules/cars/useCases/importCategory/ImportCategoryController';

const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoryController = new ImportCategoryController();

const uploadCSV = multer(uploadConfig(''));


// Routes:
categoriesRoutes.get('/', listCategoriesController.handle);
categoriesRoutes.post('/', createCategoryController.handle);

categoriesRoutes.post(
  '/import',
  uploadCSV.single('file'),
  importCategoryController.handle
);

export { categoriesRoutes };
