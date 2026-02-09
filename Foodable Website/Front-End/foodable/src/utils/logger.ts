/**
 * Logger utility for consistent logging across the application
 * Automatically disabled in production builds
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log debug information (only in development)
   */
  debug: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  /**
   * Log information (only in development)
   */
  info: (message: string, ...args: any[]): void => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },

  /**
   * Log warnings (always shown)
   */
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },

  /**
   * Log errors (always shown)
   */
  error: (message: string, error?: Error | unknown, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, error, ...args);
  },

  /**
   * Log API responses (only in development)
   */
  api: (method: string, url: string, data?: any): void => {
    if (isDevelopment) {
      console.log(`[API] ${method.toUpperCase()} ${url}`, data);
    }
  },
};

export default logger;
