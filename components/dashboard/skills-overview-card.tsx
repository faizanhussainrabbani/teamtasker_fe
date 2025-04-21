"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, PlusCircle } from "lucide-react"

// Sample skills data
const skills = [
  { name: "React", level: 90, projects: 12 },
  { name: "TypeScript", level: 85, projects: 10 },
  { name: "Node.js", level: 75, projects: 8 },
  { name: "GraphQL", level: 60, projects: 5 },
  { name: "Docker", level: 40, projects: 3 },
]

export function SkillsOverviewCard() {
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
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={skill.level} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{skill.projects} projects</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-6 w-full">
          View All Skills <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
