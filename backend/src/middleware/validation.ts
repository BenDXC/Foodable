import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './errorHandler';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * Registration validation rules
 */
export const registerValidation: ValidationChain[] = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

/**
 * Login validation rules
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Donation creation validation rules
 */
export const donationValidation: ValidationChain[] = [
  body('item_name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Item name must be between 2 and 255 characters'),
  
  body('item_quantity')
    .notEmpty()
    .withMessage('Item quantity is required')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Item quantity must be between 1 and 1000'),
  
  body('dietary_preference')
    .notEmpty()
    .withMessage('Dietary preference is required')
    .isIn(['halal', 'non-halal', 'vegan', 'vegetarian'])
    .withMessage('Invalid dietary preference'),
  
  body('expiry_date')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const expiryDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        throw new Error('Expiry date cannot be in the past');
      }
      return true;
    }),
  
  body('image_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
];

/**
 * User profile update validation rules
 */
export const updateProfileValidation: ValidationChain[] = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
];

/**
 * Password change validation rules
 */
export const changePasswordValidation: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * ID parameter validation
 */
export const idParamValidation: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
];

/**
 * Pagination query validation
 */
export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

/**
 * Email query validation
 */
export const emailQueryValidation: ValidationChain[] = [
  query('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
];

/**
 * Status query validation
 */
export const statusQueryValidation: ValidationChain[] = [
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'claimed', 'expired'])
    .withMessage('Status must be one of: pending, approved, claimed, expired'),
];

/**
 * Sanitize and validate update fields - don't allow empty updates
 */
export const hasUpdateFields = (req: Request, _res: Response, next: NextFunction): void => {
  const allowedFields = Object.keys(req.body).filter(
    key => req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== ''
  );
  
  if (allowedFields.length === 0) {
    throw new ValidationError('At least one field must be provided for update');
  }
  
  next();
};

export default validate;
