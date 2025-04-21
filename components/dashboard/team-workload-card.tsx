"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

// Sample team data
const teamMembers = [
  {
    id: "user-1",
    name: "Jane Doe",
    role: "Senior Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    workload: 85,
    tasks: 7,
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "user-2",
    name: "John Smith",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    workload: 60,
    tasks: 4,
    skills: ["React", "CSS", "UI/UX"],
  },
  {
    id: "user-3",
    name: "Emily Chen",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EC",
    workload: 45,
    tasks: 3,
    skills: ["Python", "Django", "SQL"],
  },
  {
    id: "user-4",
    name: "Michael Brown",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    workload: 70,
    tasks: 5,
    skills: ["Docker", "AWS", "CI/CD"],
  },
]

const getWorkloadColor = (workload: number) => {
  if (workload > 80) return "bg-blue-600"
  if (workload > 60) return "bg-blue-400"
  return "bg-blue-300"
}

export function TeamWorkloadCard() {
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
      </CardContent>
    </Card>
  )
}
