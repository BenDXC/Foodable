/**
 * Application constants
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  ACCOUNT_LOCKED: 'Your account has been locked due to multiple failed login attempts.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid authentication token. Please log in again.',
  TOKEN_MISSING: 'Authentication required. Please log in to continue.',
  
  // Authorization
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
  RESOURCE_NOT_OWNED: 'You can only modify resources that you own.',
  
  // Validation
  VALIDATION_FAILED: 'Please check your input and try again.',
  REQUIRED_FIELDS_MISSING: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please provide a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  
  // Database
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  DUPLICATE_ENTRY: 'A record with this information already exists.',
  RECORD_NOT_FOUND: 'The requested resource was not found.',
  
  // General
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please slow down and try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Account created successfully. Welcome!',
  LOGIN_SUCCESS: 'Welcome back! Login successful.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  UPDATE_SUCCESS: 'Your changes have been saved successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  CREATED_SUCCESS: 'Created successfully.',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 255,
  ITEM_NAME_MIN_LENGTH: 2,
  ITEM_NAME_MAX_LENGTH: 255,
  QUANTITY_MIN: 1,
  QUANTITY_MAX: 1000,
} as const;

// Dietary Preferences
export const DIETARY_PREFERENCES = [
  'halal',
  'non-halal',
  'vegan',
  'vegetarian',
] as const;

// Donation Status
export const DONATION_STATUS = [
  'pending',
  'approved',
  'claimed',
  'expired',
] as const;

// Package Status
export const PACKAGE_STATUS = [
  'available',
  'reserved',
  'claimed',
  'cancelled',
] as const;

export default {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  VALIDATION_RULES,
  DIETARY_PREFERENCES,
  DONATION_STATUS,
  PACKAGE_STATUS,
};
