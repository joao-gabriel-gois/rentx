import express, { Request, response, Response } from 'express';
import CreateCourseService from './CreateCourseService';

const routes = express.Router();

function createCourse() {
  CreateCourseService.execute({
    name: 'NodeJS',
    duration: 10,
    educator: 'Dani'
  });
}

routes.get('/', (request: Request, response: Response) => {
  createCourse();
  return response.json({message: 'Hello World'});
})


export default routes;
