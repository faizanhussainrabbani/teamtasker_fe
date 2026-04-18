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
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth';
import { parseApiError } from '@/lib/error-handling';

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
      if (data.token) {
        setAuthToken(data.token, data.refreshToken ?? undefined);
      }
      // Update the current user in the cache
      queryClient.setQueryData(authKeys.user(), data);
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
      if (data.token) {
        setAuthToken(data.token, data.refreshToken ?? undefined);
      }
      // Update the current user in the cache
      queryClient.setQueryData(authKeys.user(), data);
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
  const hasToken = typeof window !== 'undefined' && Boolean(getAuthToken());

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => getCurrentUser(),
    enabled: hasToken,
    retry: false,
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
      // Clear all cached data to prevent cross-user data leakage.
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', parseApiError(error));
      // Even if the API call fails, we should still remove the token and clear the cache
      removeAuthToken();
      queryClient.clear();
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

