import { Router } from 'express';
import { loginUser, refreshToken, registerUser } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { authorizePermissions } from '../middleware/authorize';

export const authRouter = Router();

// POST /api/v1/auth/register
authRouter.post(
  '/register',
  isAuthenticated,
  authorizePermissions(['AUTH.REGISTER_USER']),
  registerUser,
);

// POST /api/v1/auth/login
authRouter.post('/login', loginUser);

// POST /api/v1/auth/refresh-token
authRouter.post('/refresh-token', refreshToken);
