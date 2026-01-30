import { Request, Response } from 'express';

// Model
import { OrganizationModel } from '../models';
import z from 'zod';
import { handleErrors, handleSuccess } from '../utils/response.utils';

export const createOrganization = async (req: Request, res: Response) => {
  const organizationValidator = z.object({
    name: z.string().trim().min(1),
    companyLogo: z.string().trim().min(1).optional(),
    companyAddress: z.string().trim().min(1).optional(),
    email: z.string().trim().min(1),
    website: z.string().trim().min(1).optional(),
    mobileNumber: z.string().trim().min(1),
    bankName: z.string().trim().min(1).optional(),
    bankBranchName: z.string().trim().min(1).optional(),
    bankIfsc: z.string().trim().min(1).optional(),
    bankAccountNumber: z.string().trim().min(1).optional(),
    bankAccountHolderName: z.string().trim().min(1).optional(),
    signatureStamp: z.string().trim().min(1).optional(),
    gstNumber: z.string().trim().min(1).optional(),
    panNumber: z.string().trim().min(1).optional(),
    // trailStartDate and trialEndDate mandatory if trialUsage is true
    isTrailActive: z.boolean().optional(),
    isTrialExpired: z.boolean().optional(),
    trialStartDate: z
      .string()
      .optional()
      .refine((val) => val !== undefined && val !== null && val !== '', {
        message: 'Trial start date is required',
      }),
    trialEndDate: z
      .string()
      .optional()
      .refine((val) => val !== undefined && val !== null && val !== '', {
        message: 'Trial end date is required',
      }),
    // subscriptionStartDate and subscriptionEndDate mandatory if isSubscribed is true
    isSubscribed: z.boolean().optional(),
    subscriptionStartDate: z
      .string()
      .optional()
      .refine((val) => val !== undefined && val !== null && val !== '', {
        message: 'Subscription start date is required',
      }),
    subscriptionEndDate: z
      .string()
      .optional()
      .refine((val) => val !== undefined && val !== null && val !== '', {
        message: 'Subscription end date is required',
      }),
    subscriptionStatus: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional(),
    subscriptionHistory: z
      .array(
        z.object({
          startDate: z.string().trim().min(1),
          endDate: z.string().trim().min(1),
        }),
      )
      .optional(),

    // Stats
    availableBalance: z.number().optional(),
    totalExpenseAmount: z.number().optional(),
    totalPurchaseAmount: z.number().optional(),
    totalSaleAmount: z.number().optional(),
    totalProfit: z.number().optional(),
    totalTurnOver: z.number().optional(),
  });

  try {
    const body = organizationValidator.parse(req.body);

    if (body.isTrailActive && (!body.trialStartDate || !body.trialEndDate)) {
      throw new Error('Trial start date and trial end date are required');
    }

    if (body.isSubscribed && (!body.subscriptionStartDate || !body.subscriptionEndDate)) {
      throw new Error('Subscription start date and subscription end date are required');
    }

    const newOrganization = new OrganizationModel({
      name: body.name,
      companyLogo: body.companyLogo,
      companyAddress: body.companyAddress,
      email: body.email,
      website: body.website,
      mobileNumber: body.mobileNumber,
      bankName: body.bankName,
      bankBranchName: body.bankBranchName,
      bankIfsc: body.bankIfsc,
      bankAccountNumber: body.bankAccountNumber,
      bankAccountHolderName: body.bankAccountHolderName,
      signatureStamp: body.signatureStamp,
      gstNumber: body.gstNumber,
      panNumber: body.panNumber,
      isTrailActive: body.isTrailActive,
      isTrialExpired: body.isTrialExpired,
      trialStartDate: body.trialStartDate,
      trialEndDate: body.trialEndDate,
      subscriptionStartDate: body.subscriptionStartDate,
      subscriptionEndDate: body.subscriptionEndDate,
      subscriptionStatus: body.subscriptionStatus,
      availableBalance: body.availableBalance,
      totalExpenseAmount: body.totalExpenseAmount,
      totalPurchaseAmount: body.totalPurchaseAmount,
      totalSaleAmount: body.totalSaleAmount,
      totalProfit: body.totalProfit,
      totalTurnOver: body.totalTurnOver,
    });

    const savedOrganization = await newOrganization.save();

    if (!savedOrganization) {
      return handleErrors(req, res, {
        status: 400,
        error: 'Failed to create organization',
      });
    }

    handleSuccess(res, {
      status: 201,
      message: 'Organization created successfully',
      data: {
        organization: savedOrganization,
      },
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await OrganizationModel.find();

    if (!organizations) {
      throw new Error('No organizations found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Organizations fetched successfully',
      data: organizations,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationModel.findById(id);

    if (!organization) {
      throw new Error('Organization not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Organization fetched successfully',
      data: organization,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updateOrganizationSchema = z.object({
  // Company Details
  name: z.string().trim().min(1).optional(),
  companyLogo: z.string().trim().min(1).optional(),
  companyAddress: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  website: z.string().trim().min(1).optional(),
  mobileNumber: z.string().trim().min(1).optional(),

  // Bank Details
  bankName: z.string().trim().min(1).optional(),
  bankBranchName: z.string().trim().min(1).optional(),
  bankIfsc: z.string().trim().min(1).optional(),
  bankAccountNumber: z.string().trim().min(1).optional(),
  bankAccountHolderName: z.string().trim().min(1).optional(),
  signatureStamp: z.string().trim().min(1).optional(),

  // GST Details
  gstNumber: z.string().trim().min(1).optional(),
  panNumber: z.string().trim().min(1).optional(),

  // Trail
  isTrailActive: z.boolean().optional(),
  isTrialExpired: z.boolean().optional(),
  trialStartDate: z.string().trim().min(1).optional(),
  trialEndDate: z.string().trim().min(1).optional(),

  // Subscription Details
  isSubscribed: z.boolean().optional(),
  subscriptionStartDate: z.string().trim().min(1).optional(),
  subscriptionEndDate: z.string().trim().min(1).optional(),
  subscriptionStatus: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional(),
  subscriptionHistory: z
    .array(
      z.object({
        startDate: z.string().trim().min(1),
        endDate: z.string().trim().min(1),
      }),
    )
    .optional(),

  // Stats
  availableBalance: z.number().optional(),
  totalExpenseAmount: z.number().optional(),
  totalPurchaseAmount: z.number().optional(),
  totalSaleAmount: z.number().optional(),
  totalProfit: z.number().optional(),
  totalTurnOver: z.number().optional(),
});

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateOrganizationSchema.parse(req.body);

    const existingOrganization = await OrganizationModel.findById(id);

    if (!existingOrganization) {
      throw new Error('Organization not found');
    }

    if (body.name) {
      existingOrganization.name = body.name;
    }

    if (body.companyLogo) {
      existingOrganization.companyLogo = body.companyLogo;
    }

    if (body.companyAddress) {
      existingOrganization.companyAddress = body.companyAddress;
    }

    if (body.email) {
      existingOrganization.email = body.email;
    }

    if (body.website) {
      existingOrganization.website = body.website;
    }

    if (body.mobileNumber) {
      existingOrganization.mobileNumber = body.mobileNumber;
    }

    if (body.bankName) {
      existingOrganization.bankName = body.bankName;
    }

    if (body.bankBranchName) {
      existingOrganization.bankBranchName = body.bankBranchName;
    }

    if (body.bankIfsc) {
      existingOrganization.bankIfsc = body.bankIfsc;
    }

    if (body.bankAccountNumber) {
      existingOrganization.bankAccountNumber = body.bankAccountNumber;
    }

    if (body.bankAccountHolderName) {
      existingOrganization.bankAccountHolderName = body.bankAccountHolderName;
    }

    if (body.signatureStamp) {
      existingOrganization.signatureStamp = body.signatureStamp;
    }

    if (body.gstNumber) {
      existingOrganization.gstNumber = body.gstNumber;
    }

    if (body.panNumber) {
      existingOrganization.panNumber = body.panNumber;
    }

    if (body.isTrailActive) {
      if (!body.trialStartDate || !body.trialEndDate) {
        throw new Error('Trial start date and trial end date are required');
      }

      existingOrganization.isTrailActive = body.isTrailActive;
      existingOrganization.trialStartDate = new Date(body.trialStartDate);
      existingOrganization.trialEndDate = new Date(body.trialEndDate);
    }

    if (body.isTrialExpired) {
      existingOrganization.isTrialExpired = body.isTrialExpired;
    }

    if (body.isSubscribed) {
      if (!body.subscriptionStartDate || !body.subscriptionEndDate) {
        throw new Error('Subscription start date and subscription end date are required');
      }

      if (!body.subscriptionStatus) {
        throw new Error('Subscription status is required');
      }

      existingOrganization.isSubscribed = body.isSubscribed;
      existingOrganization.subscriptionStartDate = new Date(body.subscriptionStartDate);
      existingOrganization.subscriptionEndDate = new Date(body.subscriptionEndDate);
      existingOrganization.subscriptionStatus = body.subscriptionStatus;
    }

    if (body.availableBalance) {
      existingOrganization.availableBalance = body.availableBalance;
    }

    if (body.totalExpenseAmount) {
      existingOrganization.totalExpenseAmount = body.totalExpenseAmount;
    }

    if (body.totalPurchaseAmount) {
      existingOrganization.totalPurchaseAmount = body.totalPurchaseAmount;
    }

    if (body.totalSaleAmount) {
      existingOrganization.totalSaleAmount = body.totalSaleAmount;
    }

    if (body.totalProfit) {
      existingOrganization.totalProfit = body.totalProfit;
    }

    if (body.totalTurnOver) {
      existingOrganization.totalTurnOver = body.totalTurnOver;
    }

    const savedOrganization = await existingOrganization.save();

    if (!savedOrganization) {
      throw new Error('Failed to update organization');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Organization updated successfully',
      data: savedOrganization,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationModel.findByIdAndDelete(id);

    if (!organization) {
      throw new Error('Organization not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Organization deleted successfully',
      data: organization,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
