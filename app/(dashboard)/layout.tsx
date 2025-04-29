'use client';

import { useAuth } from '@/context/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Use state to ensure hydration consistency
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Only run on client-side after hydration
  useEffect(() => {
    setMounted(true);
    console.log("Dashboard layout mounted, auth state:", { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push('/login');
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // For development purposes, always show the sidebar
  // In production, you would use: const showSidebar = mounted && isAuthenticated;
  const showSidebar = true; // Always show sidebar for now

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {showSidebar ? <AppSidebar className="shrink-0" /> : null}
      <main className="flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
