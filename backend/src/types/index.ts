import { Request } from 'express';

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Express Request with User
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Donation Types
export interface Donation {
  id: number;
  user_id: number;
  item_name: string;
  item_quantity: number;
  dietary_preference: string;
  expiry_date: Date;
  image_url?: string;
  status: 'pending' | 'approved' | 'claimed' | 'expired';
  created_at: Date;
  updated_at: Date;
}

export interface DonationCreateData {
  item_name: string;
  item_quantity: number;
  dietary_preference: string;
  expiry_date: string;
  image_url?: string;
}

// Food Package Types
export interface FoodPackage {
  id: number;
  donator_id: number;
  receiver_id?: number;
  status: 'available' | 'reserved' | 'claimed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Database Query Result
export interface QueryResult {
  affectedRows: number;
  insertId: number;
}

// Environment Variables
export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_CONNECTION_LIMIT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  ALLOWED_ORIGINS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  BCRYPT_ROUNDS: number;
  LOG_LEVEL: string;
  LOG_FILE: string;
}
