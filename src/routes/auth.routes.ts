import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/authenticate';
import { authorizePermissions } from '../middleware/authorize';

export const authRouter = Router();

authRouter.post(
  '/register',
  isAuthenticated,
  authorizePermissions(['AUTH.REGISTER_USER']),
  registerUser,
);
authRouter.post('/login', loginUser);
