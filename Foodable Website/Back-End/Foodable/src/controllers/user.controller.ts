import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest, User, UserResponse } from '../types';
import { NotFoundError, UnauthorizedError } from '../middleware/errorHandler';
import { logInfo } from '../utils/logger';

/**
 * Get user by ID
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const users = await query<User[]>(
    'SELECT id, username, email, created_at FROM donator WHERE id = ?',
    [id]
  );

  if (users.length === 0) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: users[0],
  });
};

/**
 * Get user by email
 */
export const getUserByEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.query;

  if (!email) {
    throw new NotFoundError('Email parameter is required');
  }

  const users = await query<User[]>(
    'SELECT id, username, email, created_at FROM donator WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: users[0],
  });
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { username, email } = req.body;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Build update query dynamically
  const updates: string[] = [];
  const values: any[] = [];

  if (username) {
    updates.push('username = ?');
    values.push(username);
  }

  if (email) {
    updates.push('email = ?');
    values.push(email);
  }

  if (updates.length === 0) {
    throw new NotFoundError('No fields to update');
  }

  values.push(userId);

  await query(
    `UPDATE donator SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  );

  // Get updated user
  const users = await query<UserResponse[]>(
    'SELECT id, username, email, created_at FROM donator WHERE id = ?',
    [userId]
  );

  logInfo('User profile updated', { userId, updates: Object.keys(req.body) });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: users[0],
  });
};

/**
 * Delete user account
 */
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  await query('DELETE FROM donator WHERE id = ?', [userId]);

  logInfo('User account deleted', { userId });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
};

/**
 * Get all users (admin endpoint)
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const users = await query<UserResponse[]>(
    'SELECT id, username, email, created_at FROM donator LIMIT ? OFFSET ?',
    [limit, offset]
  );

  const totalResult = await query<any[]>('SELECT COUNT(*) as total FROM donator');
  const total = totalResult[0].total;

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export default {
  getUserById,
  getUserByEmail,
  updateProfile,
  deleteAccount,
  getAllUsers,
};
