import { Types } from 'mongoose';
import { Request, Response } from 'express';
import z from 'zod';

// Models
import { UserModel } from '../models';

// Utils
import { handleErrors, handleSuccess } from '../utils/response.utils';
import { generateHash, generateToken, verifyHash } from '../utils/auth.utils';

type PopulatedPermission = { code: string };
type PopulatedRole = { _id: Types.ObjectId; name: string; permissions: PopulatedPermission[] };

function isPopulatedRole(value: unknown): value is PopulatedRole {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'permissions' in value &&
    typeof (value as { name?: unknown }).name === 'string' &&
    Array.isArray((value as { permissions?: unknown }).permissions)
  );
}

const registerUserSchema = z.object({
  role: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().min(1),
  password: z.string().trim().min(1),
  mobileNumber: z.string().trim().min(1),
  profilePicture: z.string().trim().min(1).optional(),
  organization: z.string().trim().min(1),
  isActive: z.boolean().optional(),
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const body = registerUserSchema.parse(req.body);

    if (body.role === 'SUPER_ADMIN') {
      throw new Error('Super admin role is not allowed to be registered');
    }

    const existingUser = await UserModel.findOne({ email: body.email });

    if (existingUser) {
      throw new Error(`User with email '${body.email}' already exists`);
    }

    const newUser = new UserModel({
      role: body.role,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: await generateHash(body.password),
      profilePicture: body.profilePicture,
      mobileNumber: body.mobileNumber,
      organization: body.organization,
      isActive: body.isActive,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error('Failed to create user');
    }

    handleSuccess(res, {
      status: 201,
      message: 'User created successfully',
      data: savedUser,
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};

const loginUserSchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export const loginUser = async (req: Request, res: Response) => {
  try {
    const body = loginUserSchema.parse(req.body);

    const user = await UserModel.findOne({ email: body.email })
      .populate({
        path: 'role',
        select: 'name permissions',
        populate: {
          path: 'permissions',
          select: 'code',
        },
      })
      .populate('organization');

    if (!user) {
      throw new Error(`User with email '${body.email}' not found`);
    }

    const isPasswordValid = await verifyHash(body.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const userRole = user.role;
    const roleName = isPopulatedRole(userRole) ? userRole.name : null;
    const permissions = isPopulatedRole(userRole)
      ? userRole.permissions.map((permission) => permission.code)
      : [];

    const tokenPayload = {
      userId: user._id,
      role: roleName,
      permissions,
      organizationId: user.organization?._id,
    };

    const accessToken = await generateToken(tokenPayload, { expiresIn: '1d' });
    const refreshToken = await generateToken(tokenPayload, { expiresIn: '7d' });

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: roleName,
      permissions,
    };

    handleSuccess(res, {
      status: 200,
      message: 'Login successful',
      data: {
        user: userData,
        organization: user.organization,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};
