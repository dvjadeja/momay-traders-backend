import { Router } from 'express';
import { createPermission } from 'src/controllers/permissions.controller';
import { isAuthenticated } from 'src/middleware/authenticate';
import { requireSuperAdmin } from 'src/middleware/authorize';

export const permissionsRouter = Router();

// POST /api/v1/permissions
permissionsRouter.post('/', isAuthenticated, requireSuperAdmin, createPermission);

