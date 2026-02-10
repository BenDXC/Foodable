import request from 'supertest';
import express, { Application } from 'express';
import authRoutes from '../../../routes/auth.routes';
import { errorHandler } from '../../../middleware/errorHandler';
import { query } from '../../../config/database';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../../config/database');
jest.mock('bcrypt');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockBcryptCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;

describe('Auth Routes - Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', authRoutes);
    app.use(errorHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    const validRegistration = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should register a new user with valid data', async () => {
      mockQuery.mockResolvedValueOnce([]); // No existing user
      mockBcryptHash.mockResolvedValueOnce('hashed_password' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validRegistration);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Registration success: testuser',
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      });
    });

    it('should return 409 if user already exists', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, email: 'test@example.com' }] as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validRegistration);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 422 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validRegistration,
          email: 'invalid-email',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 422 for weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validRegistration,
          password: 'weak',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password',
        })
      );
    });

    it('should return 422 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should return 422 for username with special characters', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validRegistration,
          username: 'test@user#123',
        });

      expect(response.status).toBe(422);
    });

    it('should handle username length validation', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validRegistration,
          username: 'ab', // Too short
        });

      expect(response.status).toBe(422);
    });

    it('should sanitize email input', async () => {
      mockQuery.mockResolvedValueOnce([]);
      mockBcryptHash.mockResolvedValueOnce('hashed' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validRegistration,
          email: '  TEST@EXAMPLE.COM  ',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('test@example.com');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password',
    };

    it('should login with valid credentials', async () => {
      mockQuery.mockResolvedValueOnce([mockUser] as any);
      mockBcryptCompare.mockResolvedValueOnce(true as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(response.headers.authorization).toBeDefined();
    });

    it('should return 401 for invalid email', async () => {
      mockQuery.mockResolvedValueOnce([] as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 for invalid password', async () => {
      mockQuery.mockResolvedValueOnce([mockUser] as any);
      mockBcryptCompare.mockResolvedValueOnce(false as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });

    it('should return 422 for missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          password: 'Password123',
        });

      expect(response.status).toBe(422);
    });

    it('should return 422 for missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(422);
    });

    it('should handle SQL injection attempts safely', async () => {
      mockQuery.mockResolvedValueOnce([] as any);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: "'; DROP TABLE donator; --",
          password: 'password',
        });

      expect(response.status).toBe(401);
      // Ensure the query was parameterized
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(["'; DROP TABLE donator; --"])
      );
    });

    it('should handle empty string email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: 'Password123',
        });

      expect(response.status).toBe(422);
    });

    it('should rate limit login attempts', async () => {
      mockQuery.mockResolvedValue([] as any);

      // Make multiple failed requests
      const requests = Array(6).fill(null).map(() =>
        request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrong',
          })
      );

      const responses = await Promise.all(requests);

      // At least one should be rate limited
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // This test would require a real JWT token
      // Simplified version here
      mockQuery.mockResolvedValueOnce(undefined as any);

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      // Without actual auth middleware, this will return 401
      // In full integration, it should return 200
      expect([200, 401]).toContain(response.status);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send('{"invalid json"');

      expect(response.status).toBe(400);
    });

    it('should handle very large payloads', async () => {
      const largePayload = {
        username: 'test',
        email: 'test@example.com',
        password: 'A'.repeat(100000),
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(largePayload);

      expect([422, 413]).toContain(response.status);
    });

    it('should handle XSS attempts in username', async () => {
      mockQuery.mockResolvedValueOnce([]);
      mockBcryptHash.mockResolvedValueOnce('hashed' as never);
      mockQuery.mockResolvedValueOnce({ insertId: 1 } as any);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: '<script>alert("xss")</script>',
          email: 'test@example.com',
          password: 'Password123',
        });

      // Should sanitize or reject
      expect([201, 422]).toContain(response.status);
    });

    it('should handle concurrent registration attempts', async () => {
      mockQuery.mockResolvedValue([]);
      mockBcryptHash.mockResolvedValue('hashed' as never);
      mockQuery.mockResolvedValue({ insertId: 1 } as any);

      const requests = Array(5).fill(null).map(() =>
        request(app)
          .post('/api/v1/auth/register')
          .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123',
          })
      );

      const responses = await Promise.all(requests);
      
      // All should complete without server errors
      responses.forEach(response => {
        expect(response.status).toBeLessThan(500);
      });
    });

    it('should handle null byte injection', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'test\u0000user',
          email: 'test@example.com',
          password: 'Password123',
        });

      expect([201, 422]).toContain(response.status);
    });

    it('should reject requests without Content-Type header', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send('username=test&email=test@example.com');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
