import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import errorHandler from '@shared/infra/http/middlewares/errorHandler';

import routes from '@shared/infra/http/routes';
import swaggerFile from '../../../swagger.json';

import createConnection from '@shared/infra/typeorm';
import '@shared/container';

createConnection();

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);
app.use(errorHandler);

export default app;