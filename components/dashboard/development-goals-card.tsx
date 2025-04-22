"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, BookOpen, Award, PlusCircle } from "lucide-react"
import { useUserDevelopmentGoals } from "@/lib/api/hooks/useUsers"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

// Helper function to get an icon based on goal category
const getGoalIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technical':
      return BookOpen;
    case 'certification':
      return Award;
    case 'leadership':
      return Target;
    default:
      return BookOpen;
  }
};

export function DevelopmentGoalsCard() {
  // Fetch user development goals
  const { data: goals, isLoading, isError, error, refetch } = useUserDevelopmentGoals();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Development Goals</CardTitle>
          <CardDescription>Your learning and growth targets</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="Loading development goals..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading goals: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetch()}
          />
        ) : !goals || goals.length === 0 ? (
          <EmptyState
            title="No development goals found"
            description="You haven't set any development goals yet."
          />
        ) : (
          <>
            <div className="space-y-4">
              {goals.map((goal) => {
                const Icon = getGoalIcon(goal.category);
                return (
                  <div key={goal.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <Icon className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {goal.progress}% complete - {goal.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full">
              View Career Path <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
