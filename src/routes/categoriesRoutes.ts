import { Request, Response, Router } from 'express';

import CategoriesRepository from '../repositories/CategoriesRepository';

import CreateCategoryService from '../services/CreateCategoryService';
import ListCategoriesService from '../services/ListCategoriesService';


const categoriesRoutes = Router();

const categoriesRepository = new CategoriesRepository();

const createCategoryService = new CreateCategoryService(categoriesRepository);
const listCategoriesService = new ListCategoriesService(categoriesRepository);


// Routes:
categoriesRoutes.post('/', (request: Request, response: Response) => {
  const { name, description } = request.body;

  createCategoryService.execute({ name, description});

  return response.status(201).send();
});

categoriesRoutes.get('/', (request: Request, response: Response) => {
  const categories = listCategoriesService.execute();

  return response.json(categories);
});


export { categoriesRoutes };