import { Router } from 'express';

import { registerUser, loginUser } from '../controllers/authController';

export const userRoutes = Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

export default userRoutes;
