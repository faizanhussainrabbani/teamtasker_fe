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
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  // Only show the sidebar if the user is authenticated
  const showSidebar = mounted && isAuthenticated;

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar ? <AppSidebar /> : null}
      <main className={`${showSidebar ? 'flex-1' : 'w-full'} overflow-hidden`}>
        {children}
      </main>
    </div>
  );
}
