import { Router } from 'express';
import { createRole } from '../controllers/roles.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const rolesRouter = Router();

// POST /api/v1/roles
rolesRouter.post('/', isAuthenticated, requireSuperAdmin, createRole);

