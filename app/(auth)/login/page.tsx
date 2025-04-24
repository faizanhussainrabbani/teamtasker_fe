'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Login page component
 *
 * Provides a form for users to log in to the application
 *
 * @component
 * @example
 * // This component is typically rendered by the Next.js router
 * // at the /login route
 * <LoginPage />
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  /**
   * Handle form submission for login
   *
   * Prevents default form submission, sets loading state,
   * and attempts to log in the user with the provided credentials
   *
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ username, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Login</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              variant="link"
              className="px-0 font-normal text-sm h-auto py-0"
              type="button"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>



        <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        <div className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Button
            variant="link"
            className="px-0 font-normal h-auto py-0"
            type="button"
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
