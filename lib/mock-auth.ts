// Mock authentication for testing purposes
import { setAuthToken } from './auth';

// This is a mock JWT token for testing
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.mMSYCImSU1zzLtE0FjVeJsZmUYgVjbp-DHdBDmLKS1c';

/**
 * Set a mock authentication token for testing
 */
export const setMockAuth = (): void => {
  setAuthToken(MOCK_TOKEN);
  console.log('Mock authentication token set');
};

/**
 * Check if we're in a development environment
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
