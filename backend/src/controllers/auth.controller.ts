import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { config } from '../config';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../middleware/errorHandler';
import { User, LoginCredentials, RegisterData, JwtPayload, AuthRequest } from '../types';
import { logInfo, logDebug } from '../utils/logger';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: RegisterData = req.body;

  // Check if user already exists
  const existingUsers = await query<User[]>(
    'SELECT * FROM donator WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

  // Insert user into database
  const result: any = await query(
    'INSERT INTO donator (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  logInfo('User registered successfully', { userId: result.insertId, email });

  res.status(201).json({
    success: true,
    message: `Registration success: ${username}`,
    data: {
      id: result.insertId,
      username,
      email,
    },
  });
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginCredentials = req.body;

  // Find user by email
  const users = await query<User[]>(
    'SELECT * FROM donator WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const user = users[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const tokenPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, refreshToken, expiresAt]
  );

  logInfo('User logged in successfully', { userId: user.id, email });

  // Set token in response header (for frontend compatibility)
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    },
  });
};

/**
 * Logout user
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (userId) {
    // Remove all refresh tokens for this user
    await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
    logInfo('User logged out successfully', { userId });
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new BadRequestError('Refresh token is required');
  }

  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Check if token exists in database
  const tokens = await query<any[]>(
    'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
    [token, payload.userId]
  );

  if (tokens.length === 0) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Generate new access token
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  logDebug('Access token refreshed', { userId: payload.userId });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token: newAccessToken,
    },
  });
};

/**
 * Get current user profile
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  const users = await query<User[]>(
    'SELECT id, username, email, created_at FROM donator WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: users[0],
  });
};

/**
 * Change password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Get current user
  const users = await query<User[]>('SELECT * FROM donator WHERE id = ?', [userId]);

  if (users.length === 0) {
    throw new NotFoundError('User not found');
  }

  const user = users[0];

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);

  // Update password
  await query('UPDATE donator SET password = ? WHERE id = ?', [hashedPassword, userId]);

  // Invalidate all refresh tokens
  await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);

  logInfo('Password changed successfully', { userId });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  changePassword,
};
