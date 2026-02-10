// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 50,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  OTP_LENGTH: 8,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Validation failure: Please fill in all text fields.',
  INVALID_EMAIL: 'Validation failure: Invalid e-mail address. Please enter your e-mail again.',
  PASSWORD_TOO_SHORT: 'Validation failure: Password is too short. Please enter your password.',
  PASSWORDS_MISMATCH: 'Validation failure: Passwords do not match. Please retry.',
  TOS_NOT_ACCEPTED: 'Validation failure: Please agree to the Terms and Conditions, and Privacy Policy.',
  USERNAME_TOO_LONG: 'Validation failure: Username cannot be longer than 50 characters.',
  LOGIN_FAILURE: 'Login failure',
  REGISTRATION_FAILURE: 'Registration failure',
  TOKEN_FAILURE: 'Token failure',
  DATA_FAILURE: 'Data failure',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login success',
  REGISTRATION_SUCCESS: 'Registration success',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/Login',
  REGISTER: '/Registration',
  DONATOR: '/Donator',
  RECEIVER: '/Receiver',
  PROFILE: '/Profile',
  REWARDS: '/Reward',
  FOODBANK: '/Foodbank',
  ABOUT: '/About',
  CONTACT: '/Contact',
  LOGOUT: '/Logout',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  USER: '/user',
} as const;

// Button Styles
export const BUTTON_STYLES = ['btn--primary', 'btn--outline', 'btn--test'] as const;
export const BUTTON_SIZES = ['btn--medium', 'btn--large'] as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 51.53474,
    lng: -0.4686402,
  },
  DEFAULT_ZOOM: 11,
  DETAIL_ZOOM: 15,
  SEARCH_RADIUS: 1000, // 10 * 100 meters
  MARKER_SIZE: 30,
} as const;

// Environment
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'gmail',
  EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'Automated_Email',
  EMAILJS_USER_ID: import.meta.env.VITE_EMAILJS_USER_ID || '',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
