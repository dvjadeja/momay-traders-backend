import { Router } from 'express';
import { createRole } from 'src/controllers/roles.controller';
import { isAuthenticated } from 'src/middleware/authenticate';
import { requireSuperAdmin } from 'src/middleware/authorize';

export const rolesRouter = Router();

// POST /api/v1/roles
rolesRouter.post('/', isAuthenticated, requireSuperAdmin, createRole);

