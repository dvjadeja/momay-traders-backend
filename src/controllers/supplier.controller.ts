import { Request, Response } from 'express';
import { SupplierModel } from '../models';
import { handleErrors, handleSuccess } from '../utils/response.utils';
import z from 'zod';
import { isSuperAdmin } from '../utils/auth.utils';
import { getPagination, trimSearch } from '../utils/common';

export const listSuppliers = async (req: Request, res: Response) => {
  try {
    const { organizationId, role } = res.locals.user;

    const search = trimSearch(req.query.search as string);
    const { page, limit, skip } = getPagination({
      pageProp: { pageIndex: req.query.page as string },
      limitProp: { limitIndex: req.query.limit as string },
    });

    const query: any = {
      isArchived: false,
    };

    // Role-based filtering
    if (!isSuperAdmin(role)) {
      query.organization = organizationId;
    }

    // Search optimization
    if (search) {
      query.$text = { $search: search };
    }

    const [suppliers, total] = await Promise.all([
      SupplierModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          'supplierName supplierMobileNumber supplierAddress totalAmount pendingAmount paidAmount profilePicture isWhatsappEnabled createdAt',
        )
        .lean(),
      SupplierModel.countDocuments(query),
    ]);

    handleSuccess(res, {
      status: 200,
      message: 'Suppliers fetched successfully',
      data: {
        data: suppliers,
        pagination: {
          page,
          limit,
          totalRecords: total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const createSupplierValidator = z.object({
  supplierName: z.string().trim().min(1),
  supplierMobileNumber: z.string().trim().min(1),
  supplierAddress: z.string().trim().min(1),
  totalAmount: z.number().min(0),
  pendingAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  profilePicture: z.string().trim().min(1).optional(),
  isWhatsappEnabled: z.boolean().optional(),
});

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const body = createSupplierValidator.parse(req.body);
    const { userId, organizationId } = res.locals.user;

    // Check if the Same supplier name already exists
    const existingSupplier = await SupplierModel.findOne({
      supplierName: body.supplierName,
      organization: organizationId,
    });

    if (existingSupplier) {
      throw new Error('Supplier with the same name already exists');
    }

    const newSupplier = new SupplierModel({
      supplierName: body.supplierName,
      supplierMobileNumber: body.supplierMobileNumber,
      supplierAddress: body.supplierAddress,
      totalAmount: body.totalAmount,
      pendingAmount: body.pendingAmount,
      paidAmount: body.paidAmount,
      profilePicture: body.profilePicture,
      isWhatsappEnabled: body.isWhatsappEnabled,
      createdBy: userId,
      organization: organizationId,
    });

    const savedSupplier = await newSupplier.save();

    if (!savedSupplier) {
      throw new Error('Failed to create supplier');
    }

    handleSuccess(res, {
      status: 201,
      message: 'Supplier created successfully',
      data: savedSupplier,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;
    const supplier = await SupplierModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    handleSuccess(res, { status: 200, message: 'Supplier fetched successfully', data: supplier });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updateSupplierValidator = z.object({
  supplierName: z.string().trim().min(1).optional(),
  supplierMobileNumber: z.string().trim().min(1).optional(),
  supplierAddress: z.string().trim().min(1).optional(),
  totalAmount: z.number().min(0).optional(),
  pendingAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  profilePicture: z.string().trim().min(1).optional(),
  isWhatsappEnabled: z.boolean().optional(),
});

export const updateSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;
    const body = updateSupplierValidator.parse(req.body);

    // Check if the supplier exists
    const existingSupplier = await SupplierModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!existingSupplier) {
      throw new Error('Supplier not found');
    }

    if (body.supplierName) {
      existingSupplier.supplierName = body.supplierName;
    }
    if (body.supplierMobileNumber) {
      existingSupplier.supplierMobileNumber = body.supplierMobileNumber;
    }
    if (body.supplierAddress) {
      existingSupplier.supplierAddress = body.supplierAddress;
    }
    if (body.totalAmount) {
      existingSupplier.totalAmount = body.totalAmount;
    }
    if (body.pendingAmount) {
      existingSupplier.pendingAmount = body.pendingAmount;
    }
    if (body.paidAmount) {
      existingSupplier.paidAmount = body.paidAmount;
    }
    if (body.profilePicture) {
      existingSupplier.profilePicture = body.profilePicture;
    }
    if (body.isWhatsappEnabled) {
      existingSupplier.isWhatsappEnabled = body.isWhatsappEnabled;
    }

    const savedSupplier = await existingSupplier.save();
    if (!savedSupplier) {
      throw new Error('Failed to update supplier');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Supplier updated successfully',
      data: savedSupplier,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const archiveSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const supplier = await SupplierModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    supplier.isArchived = true;

    const savedSupplier = await supplier.save();

    if (!savedSupplier) {
      throw new Error('Failed to archive supplier');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Supplier archived successfully',
      data: savedSupplier,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const unarchiveSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const supplier = await SupplierModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    supplier.isArchived = false;

    const savedSupplier = await supplier.save();

    if (!savedSupplier) {
      throw new Error('Failed to unarchive supplier');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Supplier unarchived successfully',
      data: savedSupplier,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
