"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, BookOpen, Award, PlusCircle } from "lucide-react"

// Sample development goals
const developmentGoals = [
  {
    id: "goal-1",
    title: "Learn GraphQL Advanced Concepts",
    progress: "2/5 modules completed",
    icon: BookOpen,
  },
  {
    id: "goal-2",
    title: "AWS Certification",
    progress: "Scheduled for June 15",
    icon: Award,
  },
  {
    id: "goal-3",
    title: "Lead a Frontend Project",
    progress: "In progress",
    icon: Target,
  },
]

export function DevelopmentGoalsCard() {
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
        <div className="space-y-4">
          {developmentGoals.map((goal) => (
            <div key={goal.id} className="flex items-start gap-3 rounded-lg border p-3">
              <goal.icon className="mt-0.5 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{goal.title}</p>
                <p className="text-xs text-muted-foreground">{goal.progress}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-6 w-full">
          View Career Path <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
