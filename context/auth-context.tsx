'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth';
import { useLogin, useRegister, useCurrentUser, useLogout } from '@/lib/api/hooks/useAuth';
import { User } from '@/lib/api/types/users';
import { LoginRequest, RegisterRequest } from '@/lib/api/types/auth';
import { parseApiError, ApiError } from '@/lib/error-handling';
import { useToast } from '@/components/ui/use-toast';

/**
 * Authentication context type definition
 * Provides authentication state and methods for the entire application
 */
interface AuthContextType {
  /**
   * Current authenticated user or null if not authenticated
   */
  user: User | null;

  /**
   * Whether authentication operations are in progress
   */
  isLoading: boolean;

  /**
   * Whether the user is currently authenticated
   */
  isAuthenticated: boolean;

  /**
   * Log in a user with email and password
   * @param credentials - Login credentials including email and password
   */
  login: (credentials: LoginRequest) => Promise<void>;

  /**
   * Register a new user
   * @param userData - Registration data including name, email, and password
   */
  register: (userData: RegisterRequest) => Promise<void>;

  /**
   * Log out the current user
   */
  logout: () => Promise<void>;

  /**
   * Current authentication error, if any
   */
  error: ApiError | null;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider component
 *
 * Manages authentication state and provides authentication methods to the application
 *
 * @component
 * @example
 * return (
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * )
 */
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
    // Skip if we're still loading the user
    if (isLoadingUser) return;

    const token = getAuthToken();
    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

    if (!token && !isAuthPage && !isLoading) {
      // Only redirect if we've finished checking authentication
      router.push('/login');
    } else if (token && isAuthPage && !isLoading) {
      // Redirect to dashboard if already authenticated and on auth page
      router.push('/dashboard');
    }

    setIsLoading(false);
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

/**
 * Hook to access the authentication context
 *
 * Provides access to the current user, authentication state, and authentication methods
 *
 * @returns Authentication context with user data and auth methods
 * @throws Error if used outside of an AuthProvider
 *
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 *
 * // Check if user is authenticated
 * if (isAuthenticated) {
 *   // User is logged in
 *   console.log(`Hello, ${user.name}`);
 * } else {
 *   // User is not logged in
 *   login({ email, password });
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
