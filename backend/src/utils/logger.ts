import winston from 'winston';
import { config } from '../config';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.dirname(config.LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'foodable-api' },
  transports: [
    // Write all logs to file
    new winston.transports.File({
      filename: config.LOG_FILE,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write errors to separate file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (config.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create wrapper functions for common log operations with optional request ID
export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error | any, meta?: any): void => {
  logger.error(message, { 
    error: error?.message, 
    stack: error?.stack, 
    ...meta,
    ...(error && typeof error === 'object' ? error : {})
  });
};

export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any): void => {
  logger.http(message, meta);
};

// Log with request ID
export const logWithRequest = (
  level: 'info' | 'error' | 'warn' | 'debug',
  message: string,
  requestId?: string,
  meta?: any
): void => {
  const logData = { requestId, ...meta };
  
  switch (level) {
    case 'info':
      logger.info(message, logData);
      break;
    case 'error':
      logger.error(message, logData);
      break;
    case 'warn':
      logger.warn(message, logData);
      break;
    case 'debug':
      logger.debug(message, logData);
      break;
  }
};

export default logger;
