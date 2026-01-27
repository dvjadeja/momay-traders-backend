import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/utils/auth.utils';
import { handleErrors } from 'src/utils/response.utils';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (auth) {
    if (!auth.startsWith('Bearer ')) {
      return handleErrors(req, res, {
        status: 401,
        error: 'Invalid Authorization header format. Expected: Bearer <token>',
      });
    }

    const token = auth.slice(7).trim(); // Bearer TOKEN

    try {
      const decoded = await verifyToken(token);

      if (!decoded) throw new Error('Unauthorized access');

      const userId =
        typeof decoded === 'object' && decoded
          ? Number((decoded as any).userId ?? (decoded as any).id)
          : NaN;

      if (!userId || Number.isNaN(userId)) throw new Error('Invalid token payload');

      // const user = await prisma.user.findUnique({
      //   where: { id: userId },
      //   select: {
      //     id: true,
      //     username: true,
      //     firstName: true,
      //     lastName: true,
      //     roleId: true,
      //     organizationId: true,
      //     role: {
      //       select: {
      //         id: true,
      //         name: true,
      //         rolePermissions: {
      //           select: {
      //             permission: {
      //               select: { code: true },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      // if (!user) throw new Error('User not found');

      // const permissions = Array.from(
      //   new Set(
      //     user.role.rolePermissions.map((rp: { permission: { code: string } }) => rp.permission.code),
      //   ),
      // ).map((code) => ({ code }));

      // res.locals.user = {
      //   id: user.id,
      //   username: user.username,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      //   roleId: user.roleId,
      //   organizationId: user.organizationId,
      //   role: {
      //     id: user.role.id,
      //     name: user.role.name,
      //     permissions,
      //   },
      // };

      next();
    } catch (error) {
      handleErrors(req, res, {
        status: 401,
        error,
      });
    }
  } else {
    handleErrors(req, res, {
      status: 401,
      error: 'Missing Authorization token',
    });
  }
};
