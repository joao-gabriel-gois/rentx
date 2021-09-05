import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import swaggerUi from 'swagger-ui-express';

import cors from 'cors';

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

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/profiles', express.static(`${upload.tmpFolder}/avatar-images`));
app.use('/cars-images', express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

export default app;
