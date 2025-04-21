import apiClient from './client';
import { API_CONFIG } from './config';
import { getRefreshToken, setAuthToken, removeAuthToken, isTokenExpiringSoon } from '@/lib/auth';

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Queue of callbacks to execute after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh
 * @param callback Function to call when token is refreshed
 */
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers that token has been refreshed
 * @param token New access token
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh the access token using the refresh token
 * @returns Promise that resolves to the new access token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    // No refresh token available
    removeAuthToken();
    return null;
  }
  
  try {
    // Prevent multiple refresh requests
    if (isRefreshing) {
      // Return a promise that resolves when the token is refreshed
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          resolve(token);
        });
      });
    }
    
    isRefreshing = true;
    
    // Call the refresh token endpoint
    const response = await apiClient.post(
      `${API_CONFIG.endpoints.auth}/refresh-token`,
      { refreshToken }
    );
    
    const { token, refreshToken: newRefreshToken } = response.data;
    
    // Update tokens in storage
    setAuthToken(token, newRefreshToken);
    
    // Notify subscribers
    onTokenRefreshed(token);
    
    return token;
  } catch (error) {
    // If refresh fails, clear tokens and force re-login
    removeAuthToken();
    return null;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Check if token needs refresh and refresh if needed
 * @returns Promise that resolves to true if token was refreshed
 */
export const checkAndRefreshToken = async (): Promise<boolean> => {
  if (isTokenExpiringSoon()) {
    const newToken = await refreshAccessToken();
    return !!newToken;
  }
  return false;
};

// Add interceptor to automatically refresh token
apiClient.interceptors.request.use(
  async (config) => {
    // Check if token needs refresh before making request
    await checkAndRefreshToken();
    return config;
  },
  (error) => Promise.reject(error)
);
