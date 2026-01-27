import type { Request, Response } from 'express';
import { z } from 'zod';
import { handleErrors } from '../utils/response.utils';

const createPermissionSchema = z.object({
  code: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
});

export const createPermission = async (req: Request, res: Response) => {
  try {
    const body = createPermissionSchema.parse(req.body);
    const code = body.code.toUpperCase();

    // const existing = await prisma.permission.findUnique({ where: { code } });
    // if (existing) {
    //   return handleErrors(req, res, {
    //     status: 409,
    //     error: `Permission '${code}' already exists`,
    //   });
    // }

    // const permission = await prisma.permission.create({
    //   data: {
    //     code,
    //     description: body.description,
    //   },
    //   select: {
    //     id: true,
    //     code: true,
    //     description: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // });

    // return handleSuccess(res, {
    //   status: 201,
    //   message: 'Permission created',
    //   data: { permission },
    // });
  } catch (error) {
    return handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};
