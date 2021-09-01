import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import errorHandler from '@shared/infra/http/middlewares/errorHandler';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import swaggerFile from '../../../swagger.json';

import routes from '@shared/infra/http/routes';
import createConnection from '@shared/infra/typeorm';
import '@shared/container';
import upload from '@config/upload';


createConnection();

const app = express();

app.use(rateLimiter);
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/profiles', express.static(`${upload.tmpFolder}/avatar-images`));
app.use('/cars-images', express.static(`${upload.tmpFolder}/cars`));

app.use(routes);

app.use(errorHandler);

export default app;
