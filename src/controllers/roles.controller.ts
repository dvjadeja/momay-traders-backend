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
      name: body.name.toUpperCase(),
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

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await RoleModel.find();

    if (!roles) {
      throw new Error('No roles found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Roles fetched successfully',
      data: roles,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await RoleModel.findById(id).populate('permissions');

    if (!role) {
      throw new Error('Role not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Role fetched successfully',
      data: role,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getRoleByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    const role = await RoleModel.findOne({ name: name.toUpperCase() }).populate('permissions');

    if (!role) {
      throw new Error(`Role '${name}' not found`);
    }

    handleSuccess(res, {
      status: 200,
      message: 'Role fetched successfully',
      data: role,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updateRoleSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  permissions: z.array(z.string().trim().min(1)).optional(),
});

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateRoleSchema.parse(req.body);

    const existingRole = await RoleModel.findById(id);

    if (!existingRole) {
      throw new Error(`Role '${id}' not found`);
    }

    if (body.name) {
      existingRole.name = body.name.toUpperCase();
    }

    if (body.description) {
      existingRole.description = body.description;
    }

    if (body.permissions) {
      const validPermissionCodes = await PermissionModel.find({
        _id: { $in: body.permissions },
      });

      if (validPermissionCodes.length !== (body.permissions?.length ?? 0)) {
        throw new Error('Invalid permission codes');
      }

      existingRole.permissions = validPermissionCodes.map((permission) => permission._id);
    }

    const savedRole = await existingRole.save();

    if (!savedRole) {
      throw new Error('Failed to update role');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Role updated successfully',
      data: savedRole,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await RoleModel.findByIdAndDelete(id);

    if (!role) {
      throw new Error(`Role '${id}' not found`);
    }

    handleSuccess(res, {
      status: 200,
      message: 'Role deleted successfully',
      data: role,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
