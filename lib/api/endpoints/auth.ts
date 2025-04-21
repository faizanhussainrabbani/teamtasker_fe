import apiClient from '../client';
import { API_CONFIG } from '../config';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../types/auth';
import { User } from '../types/users';

const AUTH_ENDPOINT = API_CONFIG.endpoints.auth;

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post(`${AUTH_ENDPOINT}/login`, credentials);
  return response.data;
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post(`${AUTH_ENDPOINT}/register`, userData);
  return response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get(`${AUTH_ENDPOINT}/me`);
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post(`${AUTH_ENDPOINT}/logout`);
};

/**
 * Request password reset
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post(`${AUTH_ENDPOINT}/forgot-password`, data);
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post(`${AUTH_ENDPOINT}/reset-password`, data);
  return response.data;
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
  const response = await apiClient.post(`${AUTH_ENDPOINT}/change-password`, data);
  return response.data;
};
