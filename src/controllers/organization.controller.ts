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
    trialUsage: z.boolean().optional(),
    // trailStartDate and trialEndDate mandatory if trialUsage is true
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
    creditAvailable: z.number().optional(),
    totalPurchaseAmount: z.number().optional(),
    totalSaleAmount: z.number().optional(),
    totalProfit: z.number().optional(),
    totalTurnOver: z.number().optional(),
  });

  try {
    const body = organizationValidator.parse(req.body);

    if (body.trialUsage && (!body.trialStartDate || !body.trialEndDate)) {
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
      trialUsage: body.trialUsage,
      trialStartDate: body.trialStartDate,
      trialEndDate: body.trialEndDate,
      subscriptionStartDate: body.subscriptionStartDate,
      subscriptionEndDate: body.subscriptionEndDate,
      subscriptionStatus: body.subscriptionStatus,
      creditAvailable: body.creditAvailable,
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
