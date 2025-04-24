import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import { parseApiError } from '@/lib/error-handling';

// Create a custom event for unauthorized access
export const UNAUTHORIZED_EVENT = 'api:unauthorized';
export const SERVER_ERROR_EVENT = 'api:server-error';
export const NETWORK_ERROR_EVENT = 'api:network-error';

// Create a custom event dispatcher
const dispatchApiEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5220/api',
  timeout: 15000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add CORS support
  withCredentials: false,
});

// Add request logging in development
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use(request => {
    console.log('🚀 API Request:', request.method?.toUpperCase(), request.url);
    return request;
  });

  apiClient.interceptors.response.use(response => {
    console.log('✅ API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  }, error => {
    console.error('❌ API Error:', parseApiError(error));
    return Promise.reject(error);
  });
}

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

    // Removed custom X-Request-ID header to avoid CORS issues
    // config.headers['X-Request-ID'] = crypto.randomUUID();

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      dispatchApiEvent(NETWORK_ERROR_EVENT, { error });
      return Promise.reject(error);
    }

    // Handle specific error codes
    switch (error.response.status) {
      case 401: // Unauthorized
        console.error('Unauthorized access. Please log in again.');
        removeAuthToken(); // Clear invalid token
        dispatchApiEvent(UNAUTHORIZED_EVENT, { error });
        break;

      case 403: // Forbidden
        console.error('Access forbidden. You do not have permission to access this resource.');
        break;

      case 500: // Server error
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        console.error(`Server error: ${error.response.status}`);
        dispatchApiEvent(SERVER_ERROR_EVENT, { error, status: error.response.status });
        break;
    }

    return Promise.reject(error);
  }
);

// Add retry capability for idempotent requests
export const withRetry = async <T>(request: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (retries <= 0) throw error;

    // Only retry on network errors or 5xx server errors
    const shouldRetry = !axios.isAxiosError(error) ||
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600);

    if (!shouldRetry) throw error;

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));

    // Exponential backoff
    return withRetry(request, retries - 1, delay * 2);
  }
};

export default apiClient;
