import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface ValidationOptions<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (errors: Record<string, string[]>) => void;
}

interface ValidationResult<T> {
  errors: Record<string, string[]>;
  isValid: boolean;
  validateField: (field: keyof T, value: any) => boolean;
  validateForm: (data: Partial<T>) => boolean;
  resetErrors: () => void;
  setFieldError: (field: keyof T, message: string) => void;
}

/**
 * Custom hook for form validation using Zod schemas
 */
export function useFormValidation<T extends Record<string, any>>(
  options: ValidationOptions<T>
): ValidationResult<T> {
  const { schema, onSuccess, onError } = options;
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Reset all errors
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set error for a specific field
  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field as string]: [message]
    }));
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T, value: any): boolean => {
      try {
        // Create a partial schema for just this field
        const fieldSchema = schema.pick({ [field]: true });
        fieldSchema.parse({ [field]: value });
        
        // Clear errors for this field if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
        
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          // Format and set errors
          const fieldErrors: Record<string, string[]> = {};
          
          error.errors.forEach(err => {
            const path = err.path[0] as string;
            if (!fieldErrors[path]) {
              fieldErrors[path] = [];
            }
            fieldErrors[path].push(err.message);
          });
          
          setErrors(prev => ({
            ...prev,
            ...fieldErrors
          }));
        }
        
        return false;
      }
    },
    [schema]
  );

  // Validate the entire form
  const validateForm = useCallback(
    (data: Partial<T>): boolean => {
      try {
        const validData = schema.parse(data);
        resetErrors();
        onSuccess?.(validData as T);
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          // Format errors by field
          const formattedErrors: Record<string, string[]> = {};
          
          error.errors.forEach(err => {
            const path = err.path[0] as string;
            if (!formattedErrors[path]) {
              formattedErrors[path] = [];
            }
            formattedErrors[path].push(err.message);
          });
          
          setErrors(formattedErrors);
          onError?.(formattedErrors);
        }
        
        return false;
      }
    },
    [schema, resetErrors, onSuccess, onError]
  );

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    validateField,
    validateForm,
    resetErrors,
    setFieldError
  };
}

export default useFormValidation;
