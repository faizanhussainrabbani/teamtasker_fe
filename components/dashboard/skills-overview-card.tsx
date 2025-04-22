"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, PlusCircle } from "lucide-react"
import { useCurrentUserProfile } from "@/lib/api/hooks/useUsers"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

export function SkillsOverviewCard() {
  // Fetch user profile data which includes skills
  const { data: profile, isLoading, isError, error, refetch } = useCurrentUserProfile();

  // Get top 5 skills sorted by level
  const topSkills = profile?.skills
    ? [...profile.skills]
        .sort((a, b) => b.level - a.level)
        .slice(0, 5)
    : [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills Overview</CardTitle>
          <CardDescription>Your expertise and proficiency</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="Loading skills..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading skills: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetch()}
          />
        ) : !topSkills || topSkills.length === 0 ? (
          <EmptyState
            title="No skills found"
            description="You haven't added any skills to your profile yet."
          />
        ) : (
          <>
            <div className="space-y-4">
              {topSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.level} className="h-2 flex-1" />
                    {/* We don't have projects count in the API, so we'll omit this for now */}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full">
              View All Skills <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
