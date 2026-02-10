import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Add unique request ID to each request for tracing
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if request ID is already provided in header
  const existingRequestId = req.get('X-Request-ID') || req.get('X-Correlation-ID');
  
  // Generate new UUID if not provided
  const requestId = existingRequestId || randomUUID();
  
  // Attach to request object
  req.requestId = requestId;
  
  // Add to response headers for client tracking
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

export default requestIdMiddleware;
