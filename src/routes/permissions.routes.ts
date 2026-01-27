import { Router } from 'express';
import { createPermission } from '../controllers/permissions.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const permissionsRouter = Router();

// POST /api/v1/permissions
permissionsRouter.post('/', isAuthenticated, requireSuperAdmin, createPermission);
