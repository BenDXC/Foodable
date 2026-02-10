import express, { Application, Request, Response } from 'express';
import 'express-async-errors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import routes from './routes';
import {
  errorHandler,
  notFoundHandler,
  handleUncaughtErrors,
} from './middleware/errorHandler';
import {
  helmetConfig,
  corsMiddleware,
  apiRateLimiter,
  requestLogger,
  sanitizeInput,
  securityHeaders,
} from './middleware/security';
import requestIdMiddleware from './middleware/requestId';

// Handle uncaught errors
handleUncaughtErrors();

// Create Express app
const app: Application = express();

// Trust proxy (important for rate limiting and getting correct IP)
app.set('trust proxy', 1);

// Request ID tracking (must be first)
app.use(requestIdMiddleware);

// Security middleware
app.use(helmetConfig);
app.use(corsMiddleware);
app.use(securityHeaders);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Request logging (after request ID)
app.use(requestLogger);

// Sanitize input
app.use(sanitizeInput);

// Rate limiting
app.use(`/api/${config.API_VERSION}`, apiRateLimiter);

// API routes
app.use(`/api/${config.API_VERSION}`, routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Foodable API',
    version: config.API_VERSION,
    documentation: `/api/${config.API_VERSION}/health`,
    endpoints: {
      health: `/api/${config.API_VERSION}/health`,
      detailedHealth: `/api/${config.API_VERSION}/health/detailed`,
      auth: `/api/${config.API_VERSION}/auth`,
      users: `/api/${config.API_VERSION}/users`,
      donations: `/api/${config.API_VERSION}/donations`,
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
