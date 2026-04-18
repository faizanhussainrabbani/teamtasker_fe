"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, BookOpen, Award, PlusCircle } from "lucide-react"
import { LoadingState } from "@/components/ui/api-state"

const placeholderGoals = [
  {
    id: "manual-goal-1",
    title: "Complete architecture review",
    category: "technical",
    progress: 60,
    status: "in-progress",
  },
  {
    id: "manual-goal-2",
    title: "Prepare quarterly learning plan",
    category: "leadership",
    progress: 25,
    status: "planned",
  },
]

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

interface DevelopmentGoalsCardProps {
  isLoading?: boolean;
}

export function DevelopmentGoalsCard({ isLoading: cardIsLoading }: DevelopmentGoalsCardProps) {
  const isLoading = Boolean(cardIsLoading)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Development Goals</CardTitle>
          <CardDescription>Your learning and growth targets</CardDescription>
        </div>
        <Button variant="ghost" size="icon" disabled>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="Loading development goals..." />
        ) : (
          <>
            <div className="mb-4 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Goals API endpoints are not available yet. Showing local placeholder goals without server sync.
            </div>

            <div className="space-y-4">
              {placeholderGoals.map((goal) => {
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
            <Button variant="outline" size="sm" className="mt-6 w-full" disabled>
              View Career Path <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
