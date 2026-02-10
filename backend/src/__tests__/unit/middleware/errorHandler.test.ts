import { Request, Response, NextFunction } from 'express';
import {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../../../middleware/errorHandler';

describe('Error Handler Middleware - Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      originalUrl: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Test User Agent'),
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    mockNext = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle BadRequestError correctly', () => {
      const error = new BadRequestError('Invalid input');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid input',
          statusCode: 400,
        })
      );
    });

    it('should handle UnauthorizedError correctly', () => {
      const error = new UnauthorizedError('Not authenticated');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Not authenticated',
          statusCode: 401,
        })
      );
    });

    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('Resource not found');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Resource not found',
          statusCode: 404,
        })
      );
    });

    it('should handle ConflictError correctly', () => {
      const error = new ConflictError('Resource already exists');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Resource already exists',
          statusCode: 409,
        })
      );
    });

    it('should handle ValidationError with errors array', () => {
      const validationErrors = [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' },
      ];
      const error = new ValidationError('Validation failed', validationErrors);

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation failed',
          statusCode: 422,
          errors: validationErrors,
        })
      );
    });

    it('should handle JWT errors', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 401,
        })
      );
    });

    it('should handle database duplicate entry errors', () => {
      const error: any = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'A record with this value already exists',
          statusCode: 409,
        })
      );
    });

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 500,
        })
      );
    });

    it('should include stack trace in development mode', () => {
      process.env.NODE_ENV = 'development';
      const error = new BadRequestError('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String),
        })
      );
    });

    it('should not include stack trace in production mode', () => {
      process.env.NODE_ENV = 'production';
      const error = new BadRequestError('Test error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      const jsonCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');
    });
  });

  describe('notFoundHandler', () => {
    it('should create NotFoundError for undefined routes', () => {
      mockReq.originalUrl = '/api/nonexistent';

      notFoundHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Route /api/nonexistent not found',
          statusCode: 404,
        })
      );
    });

    it('should handle different HTTP methods', () => {
      mockReq.method = 'POST';
      mockReq.originalUrl = '/api/test';

      notFoundHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('asyncHandler', () => {
    it('should call next with error if async function throws', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const handler = asyncHandler(asyncFn);

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(asyncFn).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should not call next if async function succeeds', async () => {
      const asyncFn = jest.fn().mockResolvedValue(undefined);
      const handler = asyncHandler(asyncFn);

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(asyncFn).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle synchronous errors in async functions', async () => {
      const error = new Error('Sync error in async');
      const asyncFn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const handler = asyncHandler(asyncFn);

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors without message', () => {
      const error = new Error();

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      const error = { message: 'String error' };

      errorHandler(error as any, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle circular reference in error', () => {
      const error: any = new Error('Circular');
      error.circular = error;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle errors with additional properties', () => {
      const error: any = new BadRequestError('Test');
      error.customProp = 'custom value';
      error.nestedObject = { key: 'value' };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle database foreign key constraint errors', () => {
      const error: any = new Error('Foreign key constraint');
      error.code = 'ER_NO_REFERENCED_ROW_2';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Referenced resource does not exist',
        })
      );
    });

    it('should handle JSON parse errors', () => {
      const error: any = new Error('Invalid JSON');
      error.type = 'entity.parse.failed';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid JSON payload',
        })
      );
    });
  });
});
