import { ApiService, AuthService, ApiError } from '../api.service';
import axios, { AxiosError } from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService - Error Handling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('should throw ApiError on network failure', async () => {
      mockedAxios.get = jest.fn().mockRejectedValue(new Error('Network Error'));

      await expect(ApiService.get('/test')).rejects.toThrow(ApiError);
    });

    it('should handle 404 errors correctly', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 404,
          data: { message: 'Not found' },
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      try {
        await ApiService.get('/notfound');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(404);
        expect((err as ApiError).message).toBe('Not found');
      }
    });

    it('should handle 500 server errors', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      try {
        await ApiService.post('/test', {});
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(500);
      }
    });

    it('should handle timeout errors', async () => {
      const error: Partial<AxiosError> = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      await expect(ApiService.get('/slow')).rejects.toThrow(ApiError);
    });

    it('should handle connection refused errors', async () => {
      const error: Partial<AxiosError> = {
        code: 'ECONNREFUSED',
        message: 'connect ECONNREFUSED 127.0.0.1:8080',
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      await expect(ApiService.get('/test')).rejects.toThrow(ApiError);
    });

    it('should handle errors without response', async () => {
      const error: Partial<AxiosError> = {
        request: {},
        message: 'Request failed',
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      try {
        await ApiService.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(500);
      }
    });

    it('should handle malformed response data', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 400,
          data: 'Invalid JSON string',
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      await expect(ApiService.post('/test', {})).rejects.toThrow(ApiError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null response data', async () => {
      mockedAxios.get = jest.fn().mockResolvedValue({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await ApiService.get('/test');
      expect(result).toBeNull();
    });

    it('should handle empty response', async () => {
      mockedAxios.get = jest.fn().mockResolvedValue({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await ApiService.get('/test');
      expect(result).toEqual({});
    });

    it('should handle array response data', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockedAxios.get = jest.fn().mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await ApiService.get('/test');
      expect(result).toEqual(mockData);
    });

    it('should handle very large payloads', async () => {
      const largeArray = Array(10000).fill({ data: 'test' });
      mockedAxios.post = jest.fn().mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      await expect(ApiService.post('/test', largeArray)).resolves.toBeDefined();
    });

    it('should handle concurrent requests', async () => {
      mockedAxios.get = jest.fn().mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const requests = Array(10).fill(null).map((_, i) => 
        ApiService.get(`/test${i}`)
      );

      const results = await Promise.all(requests);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toEqual({ success: true });
      });
    });
  });
});

describe('AuthService - Error Handling Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: {
          authorization: 'Bearer test-token-123',
        },
        data: { success: true },
        statusText: 'OK',
        config: {} as any,
      });

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result).toEqual({ token: 'test-token-123' });
    });

    it('should throw ApiError when token not in response', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: {},
        statusText: 'OK',
        config: {} as any,
      });

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'Password123',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle 401 unauthorized errors', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      try {
        await AuthService.login({
          email: 'wrong@example.com',
          password: 'wrong',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(401);
      }
    });

    it('should handle rate limiting (429)', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 429,
          data: { message: 'Too many attempts' },
          statusText: 'Too Many Requests',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'Password123',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle network errors during login', async () => {
      mockedAxios.post = jest.fn().mockRejectedValue(new Error('Network Error'));

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'Password123',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle empty credentials', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: {
          authorization: 'Bearer token',
        },
        data: {},
        statusText: 'OK',
        config: {} as any,
      });

      const result = await AuthService.login({
        email: '',
        password: '',
      });

      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 201,
        data: { success: true },
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const result = await AuthService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'Password123',
      });

      expect(result.message).toContain('newuser');
    });

    it('should handle 409 conflict when user exists', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 409,
          data: { message: 'User already exists' },
          statusText: 'Conflict',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      try {
        await AuthService.register({
          username: 'existing',
          email: 'existing@example.com',
          password: 'Password123',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(409);
      }
    });

    it('should handle validation errors (422)', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 422,
          data: { 
            message: 'Validation failed',
            errors: [
              { field: 'email', message: 'Invalid email' },
              { field: 'password', message: 'Too weak' },
            ],
          },
          statusText: 'Unprocessable Entity',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.post = jest.fn().mockRejectedValue(error);

      await expect(
        AuthService.register({
          username: 'test',
          email: 'invalid',
          password: 'weak',
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('getUserData', () => {
    beforeEach(() => {
      sessionStorage.setItem('jwt', 'test-token');
    });

    it('should fetch user data successfully', async () => {
      const mockUserData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      mockedAxios.get = jest.fn().mockResolvedValue({
        data: mockUserData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await AuthService.getUserData('test@example.com');
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when no JWT token', async () => {
      sessionStorage.clear();

      await expect(
        AuthService.getUserData('test@example.com')
      ).rejects.toThrow(ApiError);
    });

    it('should handle 404 when user not found', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 404,
          data: { message: 'User not found' },
          statusText: 'Not Found',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      await expect(
        AuthService.getUserData('nonexistent@example.com')
      ).rejects.toThrow(ApiError);
    });

    it('should handle expired token (401)', async () => {
      const error: Partial<AxiosError> = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      };

      mockedAxios.get = jest.fn().mockRejectedValue(error);

      await expect(
        AuthService.getUserData('test@example.com')
      ).rejects.toThrow(ApiError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle SQL injection attempts', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: { authorization: 'Bearer token' },
        data: {},
        statusText: 'OK',
        config: {} as any,
      });

      await AuthService.login({
        email: "'; DROP TABLE users; --",
        password: 'password',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          email: "'; DROP TABLE users; --",
        })
      );
    });

    it('should handle XSS attempts in username', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 201,
        data: { success: true },
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      await AuthService.register({
        username: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should handle very long inputs', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 201,
        data: { success: true },
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      await AuthService.register({
        username: 'a'.repeat(10000),
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should handle special characters in password', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: { authorization: 'Bearer token' },
        data: {},
        statusText: 'OK',
        config: {} as any,
      });

      await AuthService.login({
        email: 'test@example.com',
        password: 'P@ssw0rd!#$%^&*()',
      });

      expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should handle concurrent auth requests', async () => {
      mockedAxios.post = jest.fn().mockResolvedValue({
        status: 200,
        headers: { authorization: 'Bearer token' },
        data: {},
        statusText: 'OK',
        config: {} as any,
      });

      const requests = Array(5).fill(null).map(() =>
        AuthService.login({
          email: 'test@example.com',
          password: 'Password123',
        })
      );

      const results = await Promise.all(requests);
      expect(results).toHaveLength(5);
    });
  });
});
