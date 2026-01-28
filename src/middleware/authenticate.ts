import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import { handleErrors } from '../utils/response.utils';

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

      res.locals.user = decoded;

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
