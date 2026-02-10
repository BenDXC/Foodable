import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  changePassword,
} from '../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  validate,
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { authRateLimiter } from '../middleware/security';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimiter,
  registerValidation,
  validate,
  asyncHandler(register)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  loginValidation,
  validate,
  asyncHandler(login)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(logout)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  asyncHandler(refreshToken)
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  asyncHandler(getProfile)
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  asyncHandler(changePassword)
);

export default router;
