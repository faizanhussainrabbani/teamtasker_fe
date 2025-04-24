import { User } from './users';

/**
 * Auth request payload for login
 * Matches TeamTasker.Application.Auth.Models.AuthRequest
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Auth response from the server
 * Matches TeamTasker.Application.Auth.Models.AuthResponse
 */
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  token: string;
}

// Alias for backward compatibility
export type LoginResponse = AuthResponse;

/**
 * Register request payload
 * Matches TeamTasker.Application.Auth.Models.RegisterRequest
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

// Alias for backward compatibility
export type RegisterResponse = AuthResponse;

/**
 * Forgot password request payload
 * Matches TeamTasker.Application.Auth.Models.ForgotPasswordRequest
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request payload
 * Matches TeamTasker.Application.Auth.Models.ResetPasswordRequest
 */
export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Change password request payload
 * Matches TeamTasker.Application.Auth.Models.ChangePasswordRequest
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
