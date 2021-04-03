import express from 'express';
import errorHandler from './middleware/errorHandler';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

export default app;