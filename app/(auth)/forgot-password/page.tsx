'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForgotPassword } from '@/lib/api/hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-4 mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              If an account exists with that email, we've sent password reset instructions.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full mt-4"
            onClick={() => router.push('/login')}
          >
            Return to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {forgotPasswordMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was a problem sending the reset link. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || forgotPasswordMutation.isPending}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center text-sm mt-4">
            <Button
              variant="link"
              className="px-0 font-normal h-auto py-0"
              type="button"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
