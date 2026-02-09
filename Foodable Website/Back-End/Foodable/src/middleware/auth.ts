import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, JwtPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from './errorHandler';
import { logDebug } from '../utils/logger';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_INVALID);
  }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token has expired. Please log in again.');
    }
    throw new UnauthorizedError('Invalid refresh token. Please log in again.');
  }
};

/**
 * Extract token from request headers
 */
const extractToken = (req: AuthRequest): string | null => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
};

/**
 * Authentication middleware - Verify JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_MISSING);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = decoded;

    logDebug('User authenticated', { 
      userId: decoded.userId, 
      email: decoded.email,
      requestId: req.requestId,
    });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - Does not throw error if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      logDebug('User optionally authenticated', { userId: decoded.userId });
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Authorization middleware - Check if user has required permissions
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // For now, we don't have roles in the system
      // This is a placeholder for future role-based access control
      // You can extend the User model to include roles

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user is the owner of the resource
 */
export const isOwner = (userIdField: string = 'user_id') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      if (!resourceUserId) {
        throw new ForbiddenError('Resource ownership cannot be determined');
      }

      if (parseInt(resourceUserId) !== req.user.userId) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limiting for authentication endpoints
 */
export const authRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 5 // 5 attempts
) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();

    const userAttempts = attempts.get(identifier);

    if (userAttempts && userAttempts.resetTime > now) {
      if (userAttempts.count >= max) {
        throw new UnauthorizedError(
          `Too many login attempts. Please try again later.`
        );
      }
      userAttempts.count++;
    } else {
      attempts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
    }

    next();
  };
};

export default authenticate;
