import type { Request, Response } from 'express';
import { z } from 'zod';

// Models
import { PermissionModel, RoleModel } from '../models';

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

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await PermissionModel.find();

    if (!permissions) {
      throw new Error('No permissions found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permissions fetched successfully',
      data: permissions,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await PermissionModel.findById(id);

    if (!permission) {
      throw new Error('Permission not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permission fetched successfully',
      data: permission,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getPermissionByCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code as string;
    const permission = await PermissionModel.findOne({ code: code.toUpperCase() });

    if (!permission) {
      throw new Error('Permission not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permission fetched successfully',
      data: permission,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getPermissionsByRoleId = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const role = await RoleModel.findById(roleId).select('permissions').populate('permissions');

    if (!role) {
      throw new Error('Role not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permissions fetched successfully',
      data: role.permissions,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const getPermissionsByRoleName = async (req: Request, res: Response) => {
  try {
    const name = req.params.roleName as string;
    const role = await RoleModel.findOne({ name: name.toUpperCase() })
      .select('permissions')
      .populate('permissions');

    if (!role) {
      throw new Error('Role not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permissions fetched successfully',
      data: role.permissions,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

const updatePermissionSchema = z.object({
  code: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
});

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updatePermissionSchema.parse(req.body);

    const existingPermission = await PermissionModel.findById(id);

    if (!existingPermission) {
      throw new Error('Permission not found');
    }

    if (body.code) {
      existingPermission.code = body.code.toUpperCase();
    }

    if (body.description) {
      existingPermission.description = body.description;
    }

    const savedPermission = await existingPermission.save();

    if (!savedPermission) {
      throw new Error('Failed to update permission');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permission updated successfully',
      data: savedPermission,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await PermissionModel.findByIdAndDelete(id);

    if (!permission) {
      throw new Error('Permission not found');
    }

    handleSuccess(res, {
      status: 200,
      message: 'Permission deleted successfully',
      data: permission,
    });
  } catch (error) {
    handleErrors(req, res, { status: 400, error });
  }
};
