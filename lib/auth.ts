// Authentication utilities

// Constants
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Token types
export interface TokenData {
  sub: string; // User ID
  name?: string;
  email?: string;
  role?: string;
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
}

/**
 * Get the authentication token from storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Check if token is expired
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (expiry && parseInt(expiry, 10) < Date.now()) {
    // Token is expired, remove it
    removeAuthToken();
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set the authentication token in storage
 */
export const setAuthToken = (token: string, refreshToken?: string): void => {
  localStorage.setItem(TOKEN_KEY, token);

  // Parse token to get expiration
  const tokenData = parseToken(token);
  if (tokenData?.exp) {
    // Convert exp to milliseconds and store
    const expiryMs = tokenData.exp * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryMs.toString());
  }

  // Store refresh token if provided
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Get the refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove all authentication tokens from storage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if the user is authenticated with a valid token
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if the token is about to expire (within the next 5 minutes)
 */
export const isTokenExpiringSoon = (): boolean => {
  if (typeof window === 'undefined') return false;

  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;

  // Check if token expires in the next 5 minutes
  const expiryTime = parseInt(expiry, 10);
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

  return expiryTime < fiveMinutesFromNow;
};

/**
 * Parse JWT token to get user information
 */
export const parseToken = (token: string): TokenData | null => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const base64Url = parts[1];
    // TypeScript safety check
    if (!base64Url) {
      throw new Error('Invalid JWT payload');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
};
