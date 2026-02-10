import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import { logError } from '../utils/logger';
import { config } from '../config';

/**
 * Custom error class for handling application errors
 */
export class HttpError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, true);
    this.name = 'HttpError';
  }
}

/**
 * Predefined error classes for common HTTP errors
 */
export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends HttpError {
  public errors: any[];

  constructor(message: string = 'Validation failed', errors: any[] = []) {
    super(message, 422);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

/**
 * Handle different types of errors
 */
const handleDatabaseError = (error: any): HttpError => {
  // MySQL duplicate entry error
  if (error.code === 'ER_DUP_ENTRY') {
    return new ConflictError('A record with this value already exists');
  }

  // MySQL foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new BadRequestError('Referenced resource does not exist');
  }

  // MySQL connection error
  if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
    return new InternalServerError('Database connection failed');
  }

  return new InternalServerError('Database operation failed');
};

const handleJWTError = (): HttpError => {
  return new UnauthorizedError('Invalid token');
};

const handleJWTExpiredError = (): HttpError => {
  return new UnauthorizedError('Token has expired');
};

/**
 * Send error response
 */
const sendErrorResponse = (
  res: Response,
  error: HttpError,
  isDevelopment: boolean
): void => {
  const response: any = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
  };

  // Add validation errors if present
  if (error instanceof ValidationError && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Add stack trace in development
  if (isDevelopment) {
    response.stack = error.stack;
    response.name = error.name;
  }

  res.status(error.statusCode).json(response);
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error | HttpError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let handledError: HttpError;

  // Log the error
  logError('Error occurred', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Handle known error types
  if (error instanceof HttpError) {
    handledError = error;
  } else if (error.name === 'JsonWebTokenError') {
    handledError = handleJWTError();
  } else if (error.name === 'TokenExpiredError') {
    handledError = handleJWTExpiredError();
  } else if (error.code && error.code.startsWith('ER_')) {
    handledError = handleDatabaseError(error);
  } else if (error.type === 'entity.parse.failed') {
    handledError = new BadRequestError('Invalid JSON payload');
  } else {
    // Unknown error
    handledError = new InternalServerError(
      config.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    );
  }

  sendErrorResponse(res, handledError, config.NODE_ENV === 'development');
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle uncaught exceptions and unhandled rejections
 */
export const handleUncaughtErrors = (): void => {
  process.on('uncaughtException', (error: Error) => {
    logError('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    logError('Unhandled Rejection', reason);
    process.exit(1);
  });
};

export default errorHandler;
