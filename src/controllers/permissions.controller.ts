import type { Request, Response } from 'express';
import { z } from 'zod';

// Models
import { PermissionModel } from '../models';

// Utils
import { handleErrors, handleSuccess } from '../utils/response.utils';

const createPermissionSchema = z.object({
  code: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
});

export const createPermission = async (req: Request, res: Response) => {
  try {
    const body = createPermissionSchema.parse(req.body);
    const code = body.code.toUpperCase();

    const existingPermission = await PermissionModel.findOne({ code });

    if (existingPermission) {
      throw new Error(`Permission '${code}' already exists`);
    }

    const newPermission = new PermissionModel({ code, description: body.description });
    const savedPermission = await newPermission.save();

    if (!savedPermission) {
      throw new Error('Failed to create permission');
    }

    handleSuccess(res, {
      status: 201,
      message: 'Permission created successfully',
      data: savedPermission,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
