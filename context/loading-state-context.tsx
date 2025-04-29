'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the context type
interface LoadingStateContextType {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  resetLoadingState: () => void;
}

// Create the context with a default value
const LoadingStateContext = createContext<LoadingStateContextType | undefined>(undefined);

// Provider component
export function LoadingStateProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeoutId, setLoadingTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
      }
    };
  }, [loadingTimeoutId]);

  // Set loading state with a direct value
  const setLoading = (loading: boolean) => {
    // Clear any existing timeout
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      setLoadingTimeoutId(null);
    }
    
    setIsLoading(loading);
  };

  // Start loading with automatic timeout
  const startLoading = () => {
    // Clear any existing timeout
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
    }
    
    setIsLoading(true);
    
    // Set a safety timeout to ensure loading state doesn't get stuck
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 seconds max loading time
    
    setLoadingTimeoutId(timeoutId);
  };

  // Stop loading and clear timeout
  const stopLoading = () => {
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      setLoadingTimeoutId(null);
    }
    
    setIsLoading(false);
  };

  // Reset the entire loading state
  const resetLoadingState = () => {
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      setLoadingTimeoutId(null);
    }
    
    setIsLoading(false);
  };

  return (
    <LoadingStateContext.Provider
      value={{
        isLoading,
        setLoading,
        startLoading,
        stopLoading,
        resetLoadingState
      }}
    >
      {children}
    </LoadingStateContext.Provider>
  );
}

// Hook to use the loading state context
export function useLoadingState() {
  const context = useContext(LoadingStateContext);
  
  if (context === undefined) {
    throw new Error('useLoadingState must be used within a LoadingStateProvider');
  }
  
  return context;
}
