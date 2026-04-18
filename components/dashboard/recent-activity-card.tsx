"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { EmptyState } from "@/components/ui/api-state"

interface RecentActivityCardProps {
  isLoading?: boolean;
}

export function RecentActivityCard({ isLoading: cardIsLoading }: RecentActivityCardProps) {
  const isLoading = cardIsLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <EmptyState
            title="Preparing activity feed"
            description="Recent activity is loading."
          />
        ) : (
          <EmptyState
            title="Activity feed temporarily unavailable"
            description="This panel is disabled until the backend activities API is available."
          />
        )}
      </CardContent>
    </Card>
  )
}
