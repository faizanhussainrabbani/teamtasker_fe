'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { UNAUTHORIZED_EVENT, SERVER_ERROR_EVENT, NETWORK_ERROR_EVENT } from '@/lib/api/client';

export function ApiErrorListener() {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Handle unauthorized errors (401)
    const handleUnauthorized = () => {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'destructive',
      });
      
      // Redirect to login page
      router.push('/login');
    };

    // Handle server errors (500, 502, 503, 504)
    const handleServerError = (event: CustomEvent) => {
      const { status } = event.detail;
      
      toast({
        title: 'Server Error',
        description: `We're experiencing technical difficulties. Please try again later. (${status})`,
        variant: 'destructive',
      });
    };

    // Handle network errors (no internet connection, etc.)
    const handleNetworkError = () => {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
      });
    };

    // Add event listeners
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized as EventListener);
    window.addEventListener(SERVER_ERROR_EVENT, handleServerError as EventListener);
    window.addEventListener(NETWORK_ERROR_EVENT, handleNetworkError as EventListener);

    // Clean up event listeners
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized as EventListener);
      window.removeEventListener(SERVER_ERROR_EVENT, handleServerError as EventListener);
      window.removeEventListener(NETWORK_ERROR_EVENT, handleNetworkError as EventListener);
    };
  }, [toast, router]);

  // This component doesn't render anything
  return null;
}

export default ApiErrorListener;
