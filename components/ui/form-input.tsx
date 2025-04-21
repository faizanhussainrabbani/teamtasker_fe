'use client';

import React, { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string | string[];
  showErrorMessage?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      description,
      error,
      showErrorMessage = true,
      className,
      wrapperClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      type,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    const hasError = !!error;
    const errorMessage = Array.isArray(error) ? error[0] : error;
    
    // Determine input type for password fields
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(hasError && 'text-destructive', labelClassName)}
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          <Input
            id={inputId}
            type={inputType}
            className={cn(
              hasError && 'border-destructive focus-visible:ring-destructive',
              type === 'password' && 'pr-10',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            ref={ref}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          )}
          
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>
        
        {description && !hasError && (
          <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>
            {description}
          </p>
        )}
        
        {hasError && showErrorMessage && (
          <p
            id={`${inputId}-error`}
            className={cn('text-sm font-medium text-destructive', errorClassName)}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
