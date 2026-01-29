import { Router } from 'express';
import {
  archiveCommodityById,
  createCommodity,
  getCommodities,
  getCommodityById,
  unarchiveCommodityById,
  updateCommodityById,
} from '../controllers/commodity.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { authorizePermissions } from '../middleware/authorize';

export const commodityRouter = Router();

// POST /api/v1/commodities
commodityRouter.post(
  '/',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_CREATE']),
  createCommodity,
);

// GET /api/v1/commodities
commodityRouter.get(
  '/',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_LIST']),
  getCommodities,
);

// GET /api/v1/commodities/:id
commodityRouter.get(
  '/:id',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_GET']),
  getCommodityById,
);

// PUT /api/v1/commodities/:id
commodityRouter.put(
  '/:id',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_UPDATE']),
  updateCommodityById,
);

// PUT /api/v1/commodities/:id/archive
commodityRouter.put(
  '/:id/archive',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_ARCHIVE']),
  archiveCommodityById,
);

// PUT /api/v1/commodities/:id/unarchive
commodityRouter.put(
  '/:id/unarchive',
  isAuthenticated,
  authorizePermissions(['COMMODITY.COMMODITY_UNARCHIVE']),
  unarchiveCommodityById,
);
