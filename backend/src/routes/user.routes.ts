import { Router } from 'express';
import {
  getUserById,
  getUserByEmail,
  updateProfile,
  deleteAccount,
  getAllUsers,
} from '../controllers/user.controller';
import {
  updateProfileValidation,
  validate,
  idParamValidation,
  emailQueryValidation,
  paginationValidation,
  hasUpdateFields,
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  paginationValidation,
  validate,
  asyncHandler(getAllUsers)
);

/**
 * @route   GET /api/v1/users/email
 * @desc    Get user by email
 * @access  Private
 */
router.get(
  '/email',
  authenticate,
  emailQueryValidation,
  validate,
  asyncHandler(getUserByEmail)
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  idParamValidation,
  validate,
  asyncHandler(getUserById)
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  updateProfileValidation,
  validate,
  hasUpdateFields,
  asyncHandler(updateProfile)
);

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/account',
  authenticate,
  asyncHandler(deleteAccount)
);

export default router;
