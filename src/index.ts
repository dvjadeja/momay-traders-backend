import express, { Request, Response } from 'express';

import cors from 'cors';
import { config } from 'dotenv';
import { requestMiddleware } from './middleware/logger';
import { handleSuccess } from './utils/response.utils';
import { makeRoutes } from './routes/index';
import mongoose from './setup/mongo';

mongoose.connection;

config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.use(requestMiddleware);

makeRoutes(app);

app.use(requestMiddleware);

app.get('/', (req: Request, res: Response) => {
  handleSuccess(res, {
    message: 'Express App: Sample App',
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  handleSuccess(res, {
    message: 'Health check',
  });
});

app.listen(process.env.PORT, () => console.log(`Server Up:${process.env.PORT}`));
