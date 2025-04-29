'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Reset loading state when navigating between pages
  useEffect(() => {
    console.log(`Navigation detected: ${prevPathname.current} -> ${pathname}`);

    if (prevPathname.current !== pathname) {
      console.log("Path changed, resetting loading state");
      // Use direct state updates instead of calling resetLoadingState
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        setLoadingTimeoutId(null);
      }
      setIsLoading(false);

      prevPathname.current = pathname;
    }
  }, [pathname, loadingTimeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    console.log("LoadingStateProvider mounted");

    // Initialize with loading state off
    setIsLoading(false);

    return () => {
      console.log("LoadingStateProvider unmounted");
      if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
      }
    };
  }, [loadingTimeoutId]);

  // Set loading state with a direct value
  const setLoading = (loading: boolean) => {
    console.log(`Setting loading state to: ${loading}`);

    // Clear any existing timeout
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      setLoadingTimeoutId(null);
    }

    setIsLoading(loading);
  };

  // Start loading with automatic timeout
  const startLoading = () => {
    console.log("Starting loading state");

    // Clear any existing timeout
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
    }

    setIsLoading(true);

    // Set a safety timeout to ensure loading state doesn't get stuck
    const timeoutId = setTimeout(() => {
      console.log("Safety timeout triggered, resetting loading state");
      setIsLoading(false);
    }, 5000); // 5 seconds max loading time (reduced from 10)

    setLoadingTimeoutId(timeoutId);
  };

  // Stop loading and clear timeout
  const stopLoading = () => {
    console.log("Stopping loading state");

    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      setLoadingTimeoutId(null);
    }

    setIsLoading(false);
  };

  // Reset the entire loading state
  const resetLoadingState = () => {
    console.log("Resetting loading state");

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
