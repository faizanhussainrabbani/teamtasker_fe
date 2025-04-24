/**
 * Authentication-related type definitions for the TeamTasker application.
 * These types are used across the authentication flow components and services.
 */

/**
 * Represents a user in the system
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * User's full name
   */
  name: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * URL to the user's avatar image
   * @optional
   */
  avatarUrl?: string;
  
  /**
   * User's role in the system
   * @example 'admin', 'user', 'manager'
   */
  role?: string;
  
  /**
   * When the user was created
   */
  createdAt: string;
  
  /**
   * When the user was last updated
   */
  updatedAt: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  /**
   * User's email address
   */
  email: string;
  
  /**
   * User's password
   */
  password: string;
  
  /**
   * Whether to remember the user's session
   * @default false
   */
  rememberMe?: boolean;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  /**
   * User's full name
   */
  name: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * User's password
   */
  password: string;
  
  /**
   * Confirmation of the user's password
   * Must match the password field
   */
  passwordConfirmation: string;
}

/**
 * Forgot password request payload
 */
export interface ForgotPasswordRequest {
  /**
   * User's email address
   */
  email: string;
}

/**
 * Reset password request payload
 */
export interface ResetPasswordRequest {
  /**
   * Token received via email
   */
  token: string;
  
  /**
   * New password
   */
  password: string;
  
  /**
   * Confirmation of the new password
   */
  passwordConfirmation: string;
}

/**
 * Change password request payload
 */
export interface ChangePasswordRequest {
  /**
   * Current password
   */
  currentPassword: string;
  
  /**
   * New password
   */
  newPassword: string;
  
  /**
   * Confirmation of the new password
   */
  newPasswordConfirmation: string;
}

/**
 * Authentication response from the server
 */
export interface AuthResponse {
  /**
   * JWT token for authentication
   */
  token: string;
  
  /**
   * User information
   */
  user: User;
}

/**
 * Authentication context state
 */
export interface AuthState {
  /**
   * Current authenticated user
   * Null if not authenticated
   */
  user: User | null;
  
  /**
   * Whether authentication is in progress
   */
  isLoading: boolean;
  
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  
  /**
   * Current authentication error
   */
  error: Error | null;
}
