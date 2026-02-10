import { Request, Response } from 'express';
import { pool } from '../config/database';
import { config } from '../config';
import { sendSuccess } from '../utils/response';

/**
 * Health check endpoint
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const health = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'OK',
    environment: config.NODE_ENV,
    version: config.API_VERSION,
  };

  sendSuccess(res, 'API is running', health);
};

/**
 * Detailed health check with database status
 */
export const detailedHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  // Check database connection
  let dbStatus = 'disconnected';
  let dbResponseTime = 0;
  
  try {
    const dbStart = Date.now();
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    dbResponseTime = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  const health = {
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: config.API_VERSION,
    services: {
      database: {
        status: dbStatus,
        responseTime: `${dbResponseTime}ms`,
      },
      api: {
        status: 'running',
        responseTime: `${Date.now() - startTime}ms`,
      },
    },
    system: {
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
      platform: process.platform,
      nodeVersion: process.version,
    },
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json({
    success: health.status === 'healthy',
    message: health.status === 'healthy' ? 'All systems operational' : 'System degraded',
    data: health,
  });
};

export default {
  healthCheck,
  detailedHealthCheck,
};
