import { Router } from 'express';
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizations,
  updateOrganization,
} from '../controllers/organization.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const organizationRouter = Router();

// POST /api/v1/organization
organizationRouter.post('/', isAuthenticated, requireSuperAdmin, createOrganization);

// GET /api/v1/organization
organizationRouter.get('/', isAuthenticated, requireSuperAdmin, getOrganizations);

// GET /api/v1/organization/:id
organizationRouter.get('/:id', isAuthenticated, requireSuperAdmin, getOrganizationById);

// PUT /api/v1/organization/:id
organizationRouter.put('/:id', isAuthenticated, requireSuperAdmin, updateOrganization);

// DELETE /api/v1/organization/:id
organizationRouter.delete('/:id', isAuthenticated, requireSuperAdmin, deleteOrganization);
