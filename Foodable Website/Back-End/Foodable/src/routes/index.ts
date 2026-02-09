import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import donationRoutes from './donation.routes';
import { healthCheck, detailedHealthCheck } from '../controllers/health.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Health check endpoints
router.get('/health', asyncHandler(healthCheck));
router.get('/health/detailed', asyncHandler(detailedHealthCheck));

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/donations', donationRoutes);

export default router;
