import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  login,
  register,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
} from '../endpoints/auth';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../types/auth';
import { setAuthToken, removeAuthToken } from '@/lib/auth';
import { parseApiError } from '@/lib/error-handling';
import { userKeys } from './useUsers';

// Query keys
export const authKeys = {
  user: () => ['auth', 'user'] as const,
};

/**
 * Hook for logging in a user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (data) => {
      // Save the token
      setAuthToken(data.token);
      // Update the current user in the cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', parseApiError(error));
    },
  });
};

/**
 * Hook for registering a new user
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => register(userData),
    onSuccess: (data) => {
      // Save the token
      setAuthToken(data.token);
      // Update the current user in the cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
    onError: (error) => {
      console.error('Registration error:', parseApiError(error));
    },
  });
};

/**
 * Hook for getting the current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => getCurrentUser(),
    retry: false,
    onError: (error) => {
      console.error('Error fetching current user:', parseApiError(error));
    },
  });
};

/**
 * Hook for logging out the current user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Remove the token
      removeAuthToken();
      // Clear the user from the cache
      queryClient.removeQueries({ queryKey: authKeys.user() });
      // Clear user profile data
      queryClient.removeQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error('Logout error:', parseApiError(error));
      // Even if the API call fails, we should still remove the token and clear the cache
      removeAuthToken();
      queryClient.removeQueries({ queryKey: authKeys.user() });
      queryClient.removeQueries({ queryKey: userKeys.profile() });
    },
  });
};

/**
 * Hook for requesting a password reset
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onError: (error) => {
      console.error('Forgot password error:', parseApiError(error));
    },
  });
};

/**
 * Hook for resetting a password with a token
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onError: (error) => {
      console.error('Reset password error:', parseApiError(error));
    },
  });
};

/**
 * Hook for changing a user's password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onError: (error) => {
      console.error('Change password error:', parseApiError(error));
    },
  });
};

