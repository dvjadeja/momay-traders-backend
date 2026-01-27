import type { Request, Response } from 'express';
import { z } from 'zod';

// Models
import { PermissionModel, RoleModel } from '../models';

// Utils
import { handleErrors, handleSuccess } from '../utils/response.utils';

const createRoleSchema = z.object({
  name: z.enum(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'USER']),
  description: z.string().trim().min(1).optional(),
  permissions: z.array(z.string().trim().min(1)).optional(),
});

export const createRole = async (req: Request, res: Response) => {
  try {
    const body = createRoleSchema.parse(req.body);

    const existingRole = await RoleModel.findOne({ name: body.name });

    if (existingRole) {
      throw new Error(`Role '${body.name}' already exists`);
    }

    // Check whether the permission codes are valid
    const validPermissionCodes = await PermissionModel.find({
      _id: { $in: body.permissions },
    });
    console.log('🚀 ~ createRole ~ validPermissionCodes:', validPermissionCodes);
    if (validPermissionCodes.length !== (body.permissions?.length ?? 0)) {
      throw new Error('Invalid permission codes');
    }

    // Create the role
    const newRole = new RoleModel({
      name: body.name,
      description: body.description,
      permissions: validPermissionCodes.map((permission) => permission._id),
    });
    const savedRole = await newRole.save();

    if (!savedRole) {
      throw new Error('Failed to create role');
    }

    handleSuccess(res, {
      status: 201,
      message: 'Role created successfully',
      data: savedRole,
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};
