import express, { Request, Response } from 'express';

import cors from 'cors';
import { config } from 'dotenv';
import { requestMiddleware } from './middleware/logger';
import { handleSuccess } from './utils/response.utils';

config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.use(requestMiddleware);

// app.use(requestMiddleware);

app.get('/', (req: Request, res: Response) => {
  handleSuccess(res, {
    message: 'Express App: Sample App',
  });
});

app.listen(process.env.PORT, () => console.log(`Server Up:${process.env.PORT}`));
