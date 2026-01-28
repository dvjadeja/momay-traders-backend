import { Express, Router } from 'express';
import { organizationRouter } from './organization.routes';
import { permissionsRouter } from './permissions.routes';
import { rolesRouter } from './roles.routes';
import { authRouter } from './auth.routes';
import { supplierRouter } from './supplier.routes';
import { buyerRouter } from './buyer.routes';

const routeRouterMap = {
  '/organization': organizationRouter,
  '/permissions': permissionsRouter,
  '/roles': rolesRouter,
  '/auth': authRouter,
  '/suppliers': supplierRouter,
  '/buyers': buyerRouter,
};

export const makeRoutes = (app: Express) => {
  Object.entries(routeRouterMap).forEach(([path, router]) => {
    app.use(`/api/v1${path}`, router);
  });
};
