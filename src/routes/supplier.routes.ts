import { Router } from 'express';
import {
  archiveSupplierById,
  createSupplier,
  getSupplierById,
  listSuppliers,
  unarchiveSupplierById,
  updateSupplierById,
} from '../controllers/supplier.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { authorizePermissions } from '../middleware/authorize';

export const supplierRouter = Router();

// GET /api/v1/suppliers
supplierRouter.get(
  '/',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_LIST']),
  listSuppliers,
);

// POST /api/v1/suppliers
supplierRouter.post(
  '/',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_CREATE']),
  createSupplier,
);

// GET /api/v1/suppliers/:id
supplierRouter.get(
  '/:id',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_GET']),
  getSupplierById,
);

// PUT /api/v1/suppliers/:id
supplierRouter.put(
  '/:id',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_UPDATE']),
  updateSupplierById,
);

// DELETE /api/v1/suppliers/:id
supplierRouter.put(
  '/:id/archive',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_ARCHIVE']),
  archiveSupplierById,
);

// PUT /api/v1/suppliers/:id/unarchive
supplierRouter.put(
  '/:id/unarchive',
  isAuthenticated,
  authorizePermissions(['SUPPLIER.SUPPLIER_UNARCHIVE']),
  unarchiveSupplierById,
);
