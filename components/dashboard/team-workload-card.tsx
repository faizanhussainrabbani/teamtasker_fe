"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useTeamWorkload } from "@/lib/api/hooks/useTeams"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

const getWorkloadColor = (workload: number) => {
  if (workload > 80) return "bg-blue-600"
  if (workload > 60) return "bg-blue-400"
  return "bg-blue-300"
}

interface TeamWorkloadCardProps {
  isLoading?: boolean;
}

export function TeamWorkloadCard({ isLoading: cardIsLoading }: TeamWorkloadCardProps) {
  // Fetch team workload data
  const { data: teamMembers, isLoading: dataIsLoading, isError, error, refetch } = useTeamWorkload();

  // Combine loading states
  const isLoading = cardIsLoading || dataIsLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Workload</CardTitle>
          <CardDescription>Current capacity and task distribution</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Team Details <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="Loading team workload..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading team workload: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetch()}
          />
        ) : !teamMembers || teamMembers.length === 0 ? (
          <EmptyState
            title="No team members found"
            description="There are no team members with assigned tasks."
          />
        ) : (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="text-xs font-medium">{member.workload}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={member.workload} className={`h-2 flex-1 ${getWorkloadColor(member.workload)}`} />
                    <span className="text-xs text-muted-foreground">{member.tasks} tasks</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
