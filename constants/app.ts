/**
 * Application-wide constants
 */

/**
 * API configuration
 */
export const API = {
  /**
   * Base URL for API requests
   * Uses environment variable or falls back to default
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5220/api',
  
  /**
   * API timeout in milliseconds
   */
  TIMEOUT: 30000,
  
  /**
   * API version
   */
  VERSION: 'v1',
};

/**
 * Authentication constants
 */
export const AUTH = {
  /**
   * Local storage key for auth token
   */
  TOKEN_KEY: 'teamtasker_auth_token',
  
  /**
   * Cookie name for auth token
   */
  COOKIE_NAME: 'teamtasker_auth',
  
  /**
   * Token expiration time in days
   */
  TOKEN_EXPIRATION_DAYS: 7,
};

/**
 * Route paths
 */
export const ROUTES = {
  /**
   * Authentication routes
   */
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  /**
   * Dashboard routes
   */
  DASHBOARD: {
    HOME: '/dashboard',
    PROFILE: '/profile',
    TASKS: '/tasks',
    TEAM: '/team',
  },
};

/**
 * Validation rules
 */
export const VALIDATION = {
  /**
   * Password requirements
   */
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  
  /**
   * Email validation regex
   */
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
};

/**
 * UI constants
 */
export const UI = {
  /**
   * Animation durations in milliseconds
   */
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  /**
   * Sidebar width in pixels
   */
  SIDEBAR_WIDTH: 280,
  
  /**
   * Breakpoints in pixels
   */
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
  },
};
