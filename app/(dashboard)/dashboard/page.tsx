'use client';

import { useAuth } from '@/context/auth-context';
import { TasksProvider } from '@/context/tasks-context';
import { MyTasksCard } from "@/components/dashboard/my-tasks-card";
import { LazyLoadedCards } from "@/components/dashboard/lazy-loaded-cards";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate loading dashboard data
  useEffect(() => {
    if (!isLoading && user) {
      // Simulate API call to fetch dashboard data
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col h-screen">
        <div className="h-16 border-b px-4 flex items-center">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex-1 overflow-auto p-6 w-full">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 w-full">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TasksProvider>
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-4 w-full">
          <div className="grid grid-rows-[minmax(350px,1fr)_minmax(250px,1fr)] lg:grid-rows-[minmax(350px,1fr)] gap-4 md:grid-cols-1 lg:grid-cols-2 w-full h-full">
            <div className="lg:col-span-1 w-full">
              <MyTasksCard isLoading={isPageLoading} />
            </div>
            {/* Lazy loaded components */}
            <LazyLoadedCards isLoading={isPageLoading} />
          </div>
        </div>
      </div>
    </TasksProvider>
  );
}
