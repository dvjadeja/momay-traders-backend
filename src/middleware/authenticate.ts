import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/utils/auth.utils';
import { handleErrors } from 'src/utils/response.utils';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (auth) {
    const token = auth.slice(7, auth.length); // Bearer TOKEN

    try {
      const decode = await verifyToken(token);

      if (!decode) throw new Error('Unauthorized access');

      if (!decode) throw new Error('You are unauthorized to perform this action.');

      res.locals.user = decode;

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
