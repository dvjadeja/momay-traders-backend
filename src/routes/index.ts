import { Router } from 'express';
import { permissionsRouter } from 'src/routes/permissions.routes';
import { rolesRouter } from 'src/routes/roles.routes';

export const apiRouter = Router();

apiRouter.use('/permissions', permissionsRouter);
apiRouter.use('/roles', rolesRouter);

