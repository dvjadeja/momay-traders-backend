import { Router } from 'express';
import {
  createPermission,
  deletePermission,
  getPermissionByCode,
  getPermissionById,
  getPermissions,
  getPermissionsByRoleId,
  getPermissionsByRoleName,
  updatePermission,
} from '../controllers/permissions.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const permissionsRouter = Router();

// POST /api/v1/permissions
permissionsRouter.post('/', isAuthenticated, requireSuperAdmin, createPermission);

// GET /api/v1/permissions
permissionsRouter.get('/', isAuthenticated, requireSuperAdmin, getPermissions);

// GET /api/v1/permissions/:id
permissionsRouter.get('/:id', isAuthenticated, requireSuperAdmin, getPermissionById);

// GET /api/v1/permissions/code/:code
permissionsRouter.get('/code/:code', isAuthenticated, requireSuperAdmin, getPermissionByCode);

// GET /api/v1/permissions/role/:roleId
permissionsRouter.get('/role/id/:roleId', isAuthenticated, requireSuperAdmin, getPermissionsByRoleId);

// GET /api/v1/permissions/role/:roleName
permissionsRouter.get(
  '/role/name/:roleName',
  isAuthenticated,
  requireSuperAdmin,
  getPermissionsByRoleName,
);

// PUT /api/v1/permissions/:id
permissionsRouter.put('/:id', isAuthenticated, requireSuperAdmin, updatePermission);

// DELETE /api/v1/permissions/:id
permissionsRouter.delete('/:id', isAuthenticated, requireSuperAdmin, deletePermission);
