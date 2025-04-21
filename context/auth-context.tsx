'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth';
import { useLogin, useRegister, useCurrentUser, useLogout } from '@/lib/api/hooks/useAuth';
import { User } from '@/lib/api/types/users';
import { LoginRequest, RegisterRequest } from '@/lib/api/types/auth';
import { parseApiError, ApiError } from '@/lib/error-handling';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: ApiError | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // React Query hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { 
    data: currentUser, 
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError
  } = useCurrentUser();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const token = getAuthToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    // User data will be fetched by the useCurrentUser hook
    setIsLoading(isLoadingUser);
    
    if (isErrorUser) {
      setError(parseApiError(userError));
      removeAuthToken();
      setIsLoading(false);
    }
  }, [isLoadingUser, isErrorUser, userError]);

  // Update user when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  // Redirect to login page if not authenticated and trying to access protected routes
  useEffect(() => {
    const token = getAuthToken();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    
    if (!token && !isAuthPage && !isLoading) {
      // Only redirect if we've finished checking authentication
      if (!isLoadingUser) {
        router.push('/login');
      }
    } else if (token && isAuthPage && !isLoading) {
      // Redirect to dashboard if already authenticated and on auth page
      router.push('/dashboard');
    }
  }, [pathname, isLoading, isLoadingUser, router]);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await loginMutation.mutateAsync(credentials);
      
      setAuthToken(result.token);
      setUser(result.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.user.name}!`,
      });
      
      router.push('/dashboard');
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      
      toast({
        title: "Login failed",
        description: parsedError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await registerMutation.mutateAsync(userData);
      
      setAuthToken(result.token);
      setUser(result.user);
      
      toast({
        title: "Registration successful",
        description: `Welcome to TeamTasker, ${result.user.name}!`,
      });
      
      router.push('/dashboard');
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      
      toast({
        title: "Registration failed",
        description: parsedError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      await logoutMutation.mutateAsync();
      
      removeAuthToken();
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      router.push('/login');
    } catch (err) {
      const parsedError = parseApiError(err);
      
      toast({
        title: "Logout failed",
        description: parsedError.message,
        variant: "destructive",
      });
      
      // Even if the API call fails, we should still remove the token and user
      removeAuthToken();
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
