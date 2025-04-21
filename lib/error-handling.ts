import { AxiosError } from 'axios';

/**
 * Standard API error interface
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Parse API errors from various sources into a standard format
 */
export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      status: error.response?.status,
      details: error.response?.data?.details,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unknown error occurred',
  };
};

/**
 * Format validation errors from the API
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
};
