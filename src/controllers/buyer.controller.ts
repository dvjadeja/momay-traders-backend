import { Request, Response } from 'express';

// Utils
import { handleErrors, handleSuccess } from '../utils/response.utils';

// Models
import { BuyerModel } from '../models';
import { isSuperAdmin } from '../utils/auth.utils';
import { getPagination, trimSearch } from '../utils/common';
import z from 'zod';

export const listBuyers = async (req: Request, res: Response) => {
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

    const [buyers, total] = await Promise.all([
      BuyerModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          'buyerName buyerMobileNumber buyerAddress buyerEmail totalAmount pendingAmount paidAmount profilePicture createdAt',
        )
        .lean(),
      BuyerModel.countDocuments(query),
    ]);

    handleSuccess(res, {
      status: 200,
      message: 'Buyers fetched successfully',
      data: {
        data: buyers,
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

const createBuyerValidator = z.object({
  buyerName: z.string().trim().min(1),
  buyerMobileNumber: z.string().trim().min(1),
  buyerAddress: z.string().trim().min(1),
  buyerEmail: z.string().trim().min(1).optional(),
  totalAmount: z.number().min(0),
  pendingAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  profilePicture: z.string().trim().min(1).optional(),
});

export const createBuyer = async (req: Request, res: Response) => {
  try {
    const body = createBuyerValidator.parse(req.body);
    const { userId, organizationId } = res.locals.user;

    const existingBuyer = await BuyerModel.findOne({
      buyerName: body.buyerName,
      organization: organizationId,
    });

    if (existingBuyer) {
      throw new Error('Buyer with the same name already exists');
    }

    const newBuyer = new BuyerModel({
      buyerName: body.buyerName,
      buyerMobileNumber: body.buyerMobileNumber,
      buyerAddress: body.buyerAddress,
      buyerEmail: body.buyerEmail,
      totalAmount: body.totalAmount,
      pendingAmount: body.pendingAmount,
      paidAmount: body.paidAmount,
      profilePicture: body.profilePicture,
      createdBy: userId,
      organization: organizationId,
    });

    const savedBuyer = await newBuyer.save();

    if (!savedBuyer) {
      throw new Error('Failed to create buyer');
    }

    handleSuccess(res, {
      status: 201,
      message: 'Buyer created successfully',
      data: savedBuyer,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getBuyerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const buyer = await BuyerModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Buyer fetched successfully',
      data: buyer,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updateBuyerValidator = z.object({
  buyerName: z.string().trim().min(1).optional(),
  buyerMobileNumber: z.string().trim().min(1).optional(),
  buyerAddress: z.string().trim().min(1).optional(),
  buyerEmail: z.string().trim().min(1).optional(),
  totalAmount: z.number().min(0).optional(),
  pendingAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  profilePicture: z.string().trim().min(1).optional(),
});

export const updateBuyerById = async (req: Request, res: Response) => {
  try {
    const body = updateBuyerValidator.parse(req.body);
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const existingBuyer = await BuyerModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!existingBuyer) {
      throw new Error('Buyer not found');
    }

    if (body.buyerName) {
      existingBuyer.buyerName = body.buyerName;
    }

    if (body.buyerMobileNumber) {
      existingBuyer.buyerMobileNumber = body.buyerMobileNumber;
    }

    if (body.buyerAddress) {
      existingBuyer.buyerAddress = body.buyerAddress;
    }

    if (body.buyerEmail) {
      existingBuyer.buyerEmail = body.buyerEmail;
    }

    if (body.totalAmount) {
      existingBuyer.totalAmount = body.totalAmount;
    }

    if (body.pendingAmount) {
      existingBuyer.pendingAmount = body.pendingAmount;
    }

    if (body.paidAmount) {
      existingBuyer.paidAmount = body.paidAmount;
    }

    if (body.profilePicture) {
      existingBuyer.profilePicture = body.profilePicture;
    }

    const savedBuyer = await existingBuyer.save();

    if (!savedBuyer) {
      throw new Error('Failed to update buyer');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Buyer updated successfully',
      data: savedBuyer,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const archiveBuyerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const existingBuyer = await BuyerModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!existingBuyer) {
      throw new Error('Buyer not found');
    }

    existingBuyer.isArchived = true;

    const savedBuyer = await existingBuyer.save();

    if (!savedBuyer) {
      throw new Error('Failed to archive buyer');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Buyer archived successfully',
      data: savedBuyer,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const unarchiveBuyerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId } = res.locals.user;

    const existingBuyer = await BuyerModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!existingBuyer) {
      throw new Error('Buyer not found');
    }

    existingBuyer.isArchived = false;

    const savedBuyer = await existingBuyer.save();

    if (!savedBuyer) {
      throw new Error('Failed to unarchive buyer');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Buyer unarchived successfully',
      data: savedBuyer,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
