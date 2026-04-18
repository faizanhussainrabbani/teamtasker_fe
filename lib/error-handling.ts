import { AxiosError } from 'axios';

/**
 * Standard API error interface
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
};

const getFirstValidationMessage = (errors: unknown): string | undefined => {
  const errorsRecord = asRecord(errors);
  if (!errorsRecord) {
    return undefined;
  }

  const firstErrorKey = Object.keys(errorsRecord)[0];
  if (!firstErrorKey) {
    return undefined;
  }

  const firstErrorValue = errorsRecord[firstErrorKey];
  if (Array.isArray(firstErrorValue)) {
    const firstMessage = firstErrorValue[0];
    return typeof firstMessage === 'string' ? firstMessage : undefined;
  }

  return typeof firstErrorValue === 'string' ? firstErrorValue : undefined;
};

/**
 * Parse API errors from various sources into a standard format
 */
export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const responseData = asRecord(error.response?.data);
    const validationErrors = responseData?.errors;

    const responseMessage =
      (typeof responseData?.message === 'string' ? responseData.message : undefined) ||
      (typeof responseData?.detail === 'string' ? responseData.detail : undefined) ||
      (typeof responseData?.title === 'string' ? responseData.title : undefined);

    let message = responseMessage || error.message;
    if (!message && validationErrors && typeof validationErrors === 'object') {
      message = getFirstValidationMessage(validationErrors) || 'Validation failed';
    }

    const code = typeof responseData?.code === 'string' ? responseData.code : undefined;
    const details = responseData?.details ?? validationErrors;

    return {
      message: message || 'An API error occurred',
      code,
      status: error.response?.status,
      details,
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
