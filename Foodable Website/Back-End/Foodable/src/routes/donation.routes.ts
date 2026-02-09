import { Router } from 'express';
import {
  createDonation,
  getAllDonations,
  getDonationById,
  getUserDonations,
  updateDonation,
  deleteDonation,
} from '../controllers/donation.controller';
import { donationValidation, validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/v1/donations
 * @desc    Create a new donation
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  donationValidation,
  validate,
  asyncHandler(createDonation)
);

/**
 * @route   GET /api/v1/donations
 * @desc    Get all donations (paginated)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  asyncHandler(getAllDonations)
);

/**
 * @route   GET /api/v1/donations/my-donations
 * @desc    Get current user's donations
 * @access  Private
 */
router.get(
  '/my-donations',
  authenticate,
  asyncHandler(getUserDonations)
);

/**
 * @route   GET /api/v1/donations/:id
 * @desc    Get donation by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(getDonationById)
);

/**
 * @route   PUT /api/v1/donations/:id
 * @desc    Update donation
 * @access  Private (owner only)
 */
router.put(
  '/:id',
  authenticate,
  asyncHandler(updateDonation)
);

/**
 * @route   DELETE /api/v1/donations/:id
 * @desc    Delete donation
 * @access  Private (owner only)
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(deleteDonation)
);

export default router;
