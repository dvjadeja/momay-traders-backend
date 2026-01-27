import type { Request, Response } from 'express';
import { z } from 'zod';
import { handleErrors } from '../utils/response.utils';

const createRoleSchema = z.object({
  name: z.enum(['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'USER']),
  description: z.string().trim().min(1).optional(),
  permissionCodes: z.array(z.string().trim().min(1)).optional(),
});

export const createRole = async (req: Request, res: Response) => {
  try {
    const body = createRoleSchema.parse(req.body);

    // const existing = await prisma.role.findUnique({ where: { name: body.name } });
    // if (existing) {
    //   return handleErrors(req, res, {
    //     status: 409,
    //     error: `Role '${body.name}' already exists`,
    //   });
    // }

    // const permissionCodes = Array.from(new Set(body.permissionCodes ?? []));

    // const role = await prisma.role.create({
    //   data: {
    //     name: body.name,
    //     description: body.description,
    //     rolePermissions: permissionCodes.length
    //       ? {
    //           create: permissionCodes.map((code) => ({
    //             permission: {
    //               connectOrCreate: {
    //                 where: { code },
    //                 create: { code },
    //               },
    //             },
    //           })),
    //         }
    //       : undefined,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     description: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     rolePermissions: {
    //       select: {
    //         permission: { select: { code: true, description: true } },
    //       },
    //     },
    //   },
    // });

    // return handleSuccess(res, {
    //   status: 201,
    //   message: 'Role created',
    //   data: {
    //     role: {
    //       ...role,
    //       permissions: role.rolePermissions.map((rp: { permission: { code: string; description: string | null } }) =>
    //         rp.permission,
    //       ),
    //     },
    //   },
    // });
  } catch (error) {
    return handleErrors(req, res, {
      status: 400,
      error,
    });
  }
};
