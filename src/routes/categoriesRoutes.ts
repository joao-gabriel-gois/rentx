import { Request, Response, Router } from 'express';

import CategoriesRepository from '../repositories/CategoriesRepository';

import CreateCategoryService from '../services/CreateCategoryService';
import ListCategoriesService from '../services/ListCategoriesService';


const categoriesRoutes = Router();

const categoriesRepository = new CategoriesRepository();



// Routes:
categoriesRoutes.post('/', (request: Request, response: Response) => {
  const { name, description } = request.body;
  
  const createCategoryService = new CreateCategoryService(categoriesRepository);
  
  createCategoryService.execute({ name, description});
  
  return response.status(201).send();
});

categoriesRoutes.get('/', (request: Request, response: Response) => {
  const listCategoriesService = new ListCategoriesService(categoriesRepository);
  
  const categories = listCategoriesService.execute();

  return response.json(categories);
});


export { categoriesRoutes };