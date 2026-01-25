import { Router } from 'express';
import { rolesRouter } from 'src/routes/roles.routes';

export const apiRouter = Router();

apiRouter.use('/roles', rolesRouter);

