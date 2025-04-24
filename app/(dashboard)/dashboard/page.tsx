'use client';

import { useAuth } from '@/context/auth-context';
import { TeamWorkloadCard } from "@/components/dashboard/team-workload-card";
import { MyTasksCard } from "@/components/dashboard/my-tasks-card";
import { SkillsOverviewCard } from "@/components/dashboard/skills-overview-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
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
      <div className="p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px] w-full lg:col-span-2" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full lg:col-span-2" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full lg:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyTasksCard isLoading={isPageLoading} />
        </div>
        <div className="lg:col-span-1">
          <SkillsOverviewCard isLoading={isPageLoading} />
        </div>
        <div className="lg:col-span-2">
          <TeamWorkloadCard isLoading={isPageLoading} />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityCard isLoading={isPageLoading} />
        </div>
      </div>
    </div>
  );
}
