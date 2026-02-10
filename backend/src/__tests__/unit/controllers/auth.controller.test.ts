import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  changePassword,
} from '../../../controllers/auth.controller';
import { query } from '../../../config/database';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../../config/database');
jest.mock('bcrypt');
jest.mock('../../../middleware/auth');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockBcryptCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

describe('Auth Controller - Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      user: undefined,
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([]); // No existing user
      mockBcryptHash.mockResolvedValueOnce('hashed_password' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      await register(mockReq as Request, mockRes as Response);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM donator WHERE email = ?',
        ['test@example.com']
      );
      expect(mockBcryptHash).toHaveBeenCalledWith('Password123', expect.any(Number));
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Registration success: testuser',
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      });
    });

    it('should throw ConflictError if user already exists', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([{ id: 1, email: 'existing@example.com' }] as any);

      await expect(register(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(ConflictError);
      
      expect(mockBcryptHash).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      await expect(register(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow('Database error');
    });

    it('should handle bcrypt hashing errors', async () => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([]);
      mockBcryptHash.mockRejectedValueOnce(new Error('Hashing failed') as never);

      await expect(register(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow('Hashing failed');
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    };

    it('should login user successfully with valid credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([mockUser] as any); // Find user
      mockBcryptCompare.mockResolvedValueOnce(true as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any); // Store refresh token

      await login(mockReq as Request, mockRes as Response);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM donator WHERE email = ?',
        ['test@example.com']
      );
      expect(mockBcryptCompare).toHaveBeenCalledWith('Password123', 'hashed_password');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.setHeader).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful',
          data: expect.objectContaining({
            token: expect.any(String),
            refreshToken: expect.any(String),
            user: expect.objectContaining({
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
            }),
          }),
        })
      );
    });

    it('should throw UnauthorizedError with invalid email', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([] as any);

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
      
      expect(mockBcryptCompare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError with invalid password', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockQuery.mockResolvedValueOnce([mockUser] as any);
      mockBcryptCompare.mockResolvedValueOnce(false as never);

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
    });

    it('should handle empty credentials', async () => {
      mockReq.body = {
        email: '',
        password: '',
      };

      mockQuery.mockResolvedValueOnce([] as any);

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
    });

    it('should handle database errors during login', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockQuery.mockResolvedValueOnce(undefined as any);

      await logout(mockReq as any, mockRes as Response);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [1]
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful',
      });
    });

    it('should handle logout without user context', async () => {
      mockReq.user = undefined;
      mockQuery.mockResolvedValueOnce(undefined as any);

      await logout(mockReq as any, mockRes as Response);

      expect(mockQuery).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle database errors during logout', async () => {
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      await expect(logout(mockReq as any, mockRes as Response))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      mockReq.user = { userId: 1, email: 'test@example.com' };
      
      const mockProfile = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce([mockProfile] as any);

      await getProfile(mockReq as any, mockRes as Response);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, username, email, created_at FROM donator WHERE id = ?',
        [1]
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profile retrieved successfully',
        data: mockProfile,
      });
    });

    it('should throw UnauthorizedError if user not authenticated', async () => {
      mockReq.user = undefined;

      await expect(getProfile(mockReq as any, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
      
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if user not found in database', async () => {
      mockReq.user = { userId: 999, email: 'test@example.com' };
      mockQuery.mockResolvedValueOnce([] as any);

      await expect(getProfile(mockReq as any, mockRes as Response))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('changePassword', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'old_hashed_password',
    };

    it('should change password successfully', async () => {
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockReq.body = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
      };

      mockQuery.mockResolvedValueOnce([mockUser] as any); // Get user
      mockBcryptCompare.mockResolvedValueOnce(true as never); // Verify old password
      mockBcryptHash.mockResolvedValueOnce('new_hashed_password' as never);
      mockQuery.mockResolvedValueOnce(undefined as any); // Update password
      mockQuery.mockResolvedValueOnce(undefined as any); // Delete refresh tokens

      await changePassword(mockReq as any, mockRes as Response);

      expect(mockBcryptCompare).toHaveBeenCalledWith('OldPassword123', 'old_hashed_password');
      expect(mockBcryptHash).toHaveBeenCalledWith('NewPassword456', expect.any(Number));
      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE donator SET password = ? WHERE id = ?',
        ['new_hashed_password', 1]
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should throw UnauthorizedError with incorrect current password', async () => {
      mockReq.user = { userId: 1, email: 'test@example.com' };
      mockReq.body = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword456',
      };

      mockQuery.mockResolvedValueOnce([mockUser] as any);
      mockBcryptCompare.mockResolvedValueOnce(false as never);

      await expect(changePassword(mockReq as any, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
      
      expect(mockBcryptHash).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if user not authenticated', async () => {
      mockReq.user = undefined;
      mockReq.body = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
      };

      await expect(changePassword(mockReq as any, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
      
      expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if user not found', async () => {
      mockReq.user = { userId: 999, email: 'test@example.com' };
      mockReq.body = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
      };

      mockQuery.mockResolvedValueOnce([] as any);

      await expect(changePassword(mockReq as any, mockRes as Response))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle SQL injection attempts in email', async () => {
      mockReq.body = {
        email: "test@example.com'; DROP TABLE donator; --",
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([] as any);

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
      
      // Query should be parameterized, preventing SQL injection
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM donator WHERE email = ?',
        ["test@example.com'; DROP TABLE donator; --"]
      );
    });

    it('should handle extremely long passwords', async () => {
      const longPassword = 'A'.repeat(10000);
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: longPassword,
      };

      mockQuery.mockResolvedValueOnce([]);
      mockBcryptHash.mockResolvedValueOnce('hashed' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      await register(mockReq as Request, mockRes as Response);

      expect(mockBcryptHash).toHaveBeenCalledWith(longPassword, expect.any(Number));
    });

    it('should handle special characters in username', async () => {
      mockReq.body = {
        username: 'test<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'Password123',
      };

      mockQuery.mockResolvedValueOnce([]);
      mockBcryptHash.mockResolvedValueOnce('hashed' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'test<script>alert("xss")</script>',
          }),
        })
      );
    });

    it('should handle null/undefined values gracefully', async () => {
      mockReq.body = {
        email: null,
        password: undefined,
      };

      mockQuery.mockResolvedValueOnce([] as any);

      await expect(login(mockReq as Request, mockRes as Response))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });
});
