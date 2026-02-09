import dotenv from 'dotenv';
import { EnvConfig } from '../types';

// Load environment variables
dotenv.config();

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const config: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 8080),
  API_VERSION: getEnvVar('API_VERSION', 'v1'),
  
  // Database
  DB_HOST: getEnvVar('DB_HOST', 'localhost'),
  DB_PORT: getEnvNumber('DB_PORT', 3306),
  DB_USER: getEnvVar('DB_USER', 'root'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', 'root'),
  DB_NAME: getEnvVar('DB_NAME', 'foodable'),
  DB_CONNECTION_LIMIT: getEnvNumber('DB_CONNECTION_LIMIT', 10),
  
  // JWT
  JWT_SECRET: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '24h'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET', 'your-super-secret-refresh-key-change-this-in-production'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  
  // CORS
  ALLOWED_ORIGINS: getEnvVar('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  
  // Security
  BCRYPT_ROUNDS: getEnvNumber('BCRYPT_ROUNDS', 10),
  
  // Logging
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  LOG_FILE: getEnvVar('LOG_FILE', 'logs/app.log'),
};

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
