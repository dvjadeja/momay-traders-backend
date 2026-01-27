import { Router } from 'express';
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoleByName,
  getRoles,
  updateRole,
} from '../controllers/roles.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const rolesRouter = Router();

// POST /api/v1/roles
rolesRouter.post('/', isAuthenticated, requireSuperAdmin, createRole);

// GET /api/v1/roles
rolesRouter.get('/', isAuthenticated, requireSuperAdmin, getRoles);

// GET /api/v1/roles/:id
rolesRouter.get('/:id', isAuthenticated, requireSuperAdmin, getRoleById);

// GET /api/v1/roles/name/:name
rolesRouter.get('/name/:name', isAuthenticated, requireSuperAdmin, getRoleByName);

// PUT /api/v1/roles/:id
rolesRouter.put('/:id', isAuthenticated, requireSuperAdmin, updateRole);

// DELETE /api/v1/roles/:id
rolesRouter.delete('/:id', isAuthenticated, requireSuperAdmin, deleteRole);
