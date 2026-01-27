import type { NextFunction, Request, Response } from 'express';
import { handleErrors } from '../utils/response.utils';

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return handleErrors(req, res, {
      status: 401,
      error: 'Unauthorized',
    });
  }

  if (user.role?.name !== 'SUPER_ADMIN') {
    return handleErrors(req, res, {
      status: 403,
      error: 'Forbidden: SUPER_ADMIN only',
    });
  }

  return next();
};

export const authorizePermissions =
  (requiredPermissionCodes: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return handleErrors(req, res, {
        status: 401,
        error: 'Unauthorized',
      });
    }

    // SUPER_ADMIN bypass
    if (user.role?.name === 'SUPER_ADMIN') return next();

    const required = requiredPermissionCodes?.filter(Boolean) ?? [];
    if (required.length === 0) return next();

    const userCodes = new Set(user.role.permissions.map((p: { code: string }) => p.code));
    const hasAll = required.every((code) => userCodes.has(code));

    if (!hasAll) {
      return handleErrors(req, res, {
        status: 403,
        error: `Forbidden: missing required permissions (${required.join(', ')})`,
      });
    }

    return next();
  };
