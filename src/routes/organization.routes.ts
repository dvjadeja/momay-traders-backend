import { Router } from 'express';
import { createOrganization } from '../controllers/organization.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { requireSuperAdmin } from '../middleware/authorize';

export const organizationRouter = Router();

// POST /api/v1/organization
organizationRouter.post('/', isAuthenticated, requireSuperAdmin, createOrganization);
