"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useActivities } from "@/lib/api/hooks/useActivities"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

interface RecentActivityCardProps {
  isLoading?: boolean;
}

export function RecentActivityCard({ isLoading: cardIsLoading }: RecentActivityCardProps) {
  // State to track if we should load activities
  const [shouldFetchData, setShouldFetchData] = useState(false);

  // Only fetch activities after component has mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetchData(true);
    }, 500); // Small delay to prioritize core components

    return () => clearTimeout(timer);
  }, []);

  // Fetch activities with React Query, but only when shouldFetchData is true
  const {
    data,
    isLoading: dataIsLoading,
    isError,
    error,
    refetch
  } = useActivities(
    { limit: 5 },
    { enabled: shouldFetchData } // Only run query when shouldFetchData is true
  );

  // Combine loading states
  const isLoading = cardIsLoading || dataIsLoading || !shouldFetchData;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {isLoading ? (
          <LoadingState message="Loading activities..." />
        ) : isError ? (
          <EmptyState
            title="No activities found"
            description="There are no recent activities to display."
            action={
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            }
          />
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="There has been no recent activity in your team."
          />
        ) : (
          <div className="space-y-4">
            {data.data.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                    {activity.assignee && (
                      <>
                        {" "}
                        <span className="text-muted-foreground">to</span>{" "}
                        <span className="font-medium">{activity.assignee.name}</span>
                      </>
                    )}
                  </p>
                  {activity.comment && <p className="text-sm text-muted-foreground">"{activity.comment}"</p>}
                  <p className="text-xs text-muted-foreground">{activity.timestamp || activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
