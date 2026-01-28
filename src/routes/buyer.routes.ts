import { Router } from 'express';
import {
  archiveBuyerById,
  createBuyer,
  getBuyerById,
  listBuyers,
  unarchiveBuyerById,
  updateBuyerById,
} from '../controllers/buyer.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { authorizePermissions } from '../middleware/authorize';

export const buyerRouter = Router();

// GET /api/v1/buyers
buyerRouter.get('/', isAuthenticated, authorizePermissions(['BUYER.BUYER_LIST']), listBuyers);

// POST /api/v1/buyers
buyerRouter.post('/', isAuthenticated, authorizePermissions(['BUYER.BUYER_CREATE']), createBuyer);

// GET /api/v1/buyers/:id
buyerRouter.get('/:id', isAuthenticated, authorizePermissions(['BUYER.BUYER_GET']), getBuyerById);

// PUT /api/v1/buyers/:id
buyerRouter.put(
  '/:id',
  isAuthenticated,
  authorizePermissions(['BUYER.BUYER_UPDATE']),
  updateBuyerById,
);

// Archive /api/v1/buyers/:id
buyerRouter.put(
  '/:id/archive',
  isAuthenticated,
  authorizePermissions(['BUYER.BUYER_ARCHIVE']),
  archiveBuyerById,
);

// Unarchive /api/v1/buyers/:id
buyerRouter.put(
  '/:id/unarchive',
  isAuthenticated,
  authorizePermissions(['BUYER.BUYER_UNARCHIVE']),
  unarchiveBuyerById,
);
