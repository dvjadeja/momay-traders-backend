import { Request, Response } from 'express';
import z from 'zod';

// Models
import { CommodityModel } from '../models';

// Utils
import { handleErrors, handleSuccess } from '../utils/response.utils';
import { getPagination, trimSearch } from '../utils/common';
import { isSuperAdmin } from '../utils/auth.utils';

// Validators
const createCommodityValidator = z.object({
  name: z.string().trim().min(1),
  availableQuantity: z.number().min(0),
});

export const createCommodity = async (req: Request, res: Response) => {
  try {
    const body = createCommodityValidator.parse(req.body);
    const { userId, organizationId } = res.locals.user;

    const existingCommodity = await CommodityModel.findOne({
      name: body.name,
      organization: organizationId,
    });

    if (existingCommodity) {
      throw new Error('Commodity with the same name already exists');
    }

    const newCommodity = new CommodityModel({
      name: body.name,
      availableQuantity: body.availableQuantity,
      createdBy: userId,
      organization: organizationId,
    });

    const savedCommodity = await newCommodity.save();

    if (!savedCommodity) {
      throw new Error('Failed to create commodity');
    }

    handleSuccess(res, {
      status: 201,
      message: 'Commodity created successfully',
      data: savedCommodity,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getCommodities = async (req: Request, res: Response) => {
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

    const [commodities, total] = await Promise.all([
      CommodityModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name availableQuantity isArchived createdBy createdAt')
        .lean(),
      CommodityModel.countDocuments(query),
    ]);

    handleSuccess(res, {
      status: 200,
      message: 'Commodities fetched successfully',
      data: {
        data: commodities,
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

export const getCommodityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = res.locals.user;

    const query: any = {
      _id: id,
    };

    // Role-based filtering
    if (!isSuperAdmin(role)) {
      query.organization = organizationId;
    }

    const commodity = await CommodityModel.findOne(query);

    if (!commodity) {
      throw new Error('Commodity not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Commodity fetched successfully',
      data: commodity,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updateCommodityValidator = z.object({
  name: z.string().trim().min(1).optional(),
  availableQuantity: z.number().min(0).optional(),
});

export const updateCommodityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = res.locals.user;
    const body = updateCommodityValidator.parse(req.body);

    const query: any = {
      _id: id,
    };

    // Role-based filtering
    if (!isSuperAdmin(role)) {
      query.organization = organizationId;
    }

    const existingCommodity = await CommodityModel.findOne(query);

    if (!existingCommodity) {
      throw new Error('Commodity not found');
    }

    if (body.name) {
      existingCommodity.name = body.name;
    }

    if (body.availableQuantity) {
      existingCommodity.availableQuantity = body.availableQuantity;
    }

    const savedCommodity = await existingCommodity.save();

    if (!savedCommodity) {
      throw new Error('Failed to update commodity');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Commodity updated successfully',
      data: savedCommodity,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const archiveCommodityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = res.locals.user;

    const query: any = {
      _id: id,
    };

    // Role-based filtering
    if (!isSuperAdmin(role)) {
      query.organization = organizationId;
    }

    const existingCommodity = await CommodityModel.findOne(query);

    if (!existingCommodity) {
      throw new Error('Commodity not found');
    }

    existingCommodity.isArchived = true;

    const savedCommodity = await existingCommodity.save();

    if (!savedCommodity) {
      throw new Error('Failed to archive commodity');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Commodity archived successfully',
      data: savedCommodity,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const unarchiveCommodityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId, role } = res.locals.user;

    const query: any = {
      _id: id,
    };

    // Role-based filtering
    if (!isSuperAdmin(role)) {
      query.organization = organizationId;
    }

    const existingCommodity = await CommodityModel.findOne(query);

    if (!existingCommodity) {
      throw new Error('Commodity not found');
    }

    existingCommodity.isArchived = false;

    const savedCommodity = await existingCommodity.save();

    if (!savedCommodity) {
      throw new Error('Failed to unarchive commodity');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Commodity unarchived successfully',
      data: savedCommodity,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
