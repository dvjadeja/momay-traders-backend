import { Router } from 'express';
import { permissionsRouter } from '../routes/permissions.routes';
import { rolesRouter } from '../routes/roles.routes';

export const apiRouter = Router();

apiRouter.use('/permissions', permissionsRouter);
apiRouter.use('/roles', rolesRouter);
