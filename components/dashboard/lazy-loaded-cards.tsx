'use client';

import { useState, useEffect } from 'react';
import { TeamWorkloadCard } from './team-workload-card';
import { RecentActivityCard } from './recent-activity-card';

interface LazyLoadedCardsProps {
  isLoading?: boolean;
}

export function LazyLoadedCards({ isLoading }: LazyLoadedCardsProps) {
  const [isClient, setIsClient] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // This ensures the component only renders on the client
  useEffect(() => {
    setIsClient(true);
    
    // Delay loading of non-essential components
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000); // 1 second delay after initial render
    
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Team Workload Card */}
      <div className="lg:col-span-1 w-full">
        {shouldLoad ? (
          <TeamWorkloadCard isLoading={isLoading} />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-lg border">
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">Loading team workload data...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Activity Card */}
      <div className="lg:col-span-2 w-full">
        {shouldLoad ? (
          <RecentActivityCard isLoading={isLoading} />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-lg border">
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">Loading recent activity data...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
