'use client';

import { useAuth } from '@/context/auth-context';
import { TeamWorkloadCard } from "@/components/dashboard/team-workload-card";
import { MyTasksCard } from "@/components/dashboard/my-tasks-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DevelopmentGoalsCard } from "@/components/dashboard/development-goals-card";
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

    return undefined;
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-4 lg:grid-cols-12">
          <Skeleton className="h-[280px] w-full lg:col-span-8" />
          <Skeleton className="h-[280px] w-full lg:col-span-4" />
          <Skeleton className="h-[320px] w-full lg:col-span-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border bg-gradient-to-br from-muted/40 via-background to-muted/20 p-4 shadow-sm md:p-5">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <MyTasksCard isLoading={isPageLoading} />
            </div>
            <div className="lg:col-span-4">
              <DevelopmentGoalsCard isLoading={isPageLoading} />
            </div>
            <div className="lg:col-span-12">
              <TeamWorkloadCard isLoading={isPageLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
