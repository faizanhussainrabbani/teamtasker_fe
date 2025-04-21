"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Sample team data
const teamMembers = [
  {
    id: "user-1",
    name: "Jane Doe",
    role: "Senior Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    workload: 85,
    tasks: [
      { name: "API Integration", priority: "high", dueDate: "2023-05-15" },
      { name: "Code Review", priority: "medium", dueDate: "2023-05-16" },
      { name: "Security Audit", priority: "high", dueDate: "2023-05-25" },
    ],
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "user-2",
    name: "John Smith",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    workload: 60,
    tasks: [
      { name: "User Dashboard Redesign", priority: "medium", dueDate: "2023-05-18" },
      { name: "Component Library", priority: "low", dueDate: "2023-05-22" },
    ],
    skills: ["React", "CSS", "UI/UX"],
  },
  {
    id: "user-3",
    name: "Emily Chen",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EC",
    workload: 45,
    tasks: [{ name: "Database Optimization", priority: "medium", dueDate: "2023-05-20" }],
    skills: ["Python", "Django", "SQL"],
  },
  {
    id: "user-4",
    name: "Michael Brown",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    workload: 70,
    tasks: [
      { name: "CI/CD Pipeline", priority: "high", dueDate: "2023-05-17" },
      { name: "Server Monitoring", priority: "medium", dueDate: "2023-05-19" },
    ],
    skills: ["Docker", "AWS", "CI/CD"],
  },
  {
    id: "user-5",
    name: "Sarah Wilson",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    workload: 75,
    tasks: [
      { name: "Sprint Planning", priority: "high", dueDate: "2023-05-14" },
      { name: "Stakeholder Meeting", priority: "medium", dueDate: "2023-05-16" },
      { name: "Product Roadmap", priority: "medium", dueDate: "2023-05-23" },
    ],
    skills: ["Product Management", "Agile", "User Research"],
  },
]

// Update the getWorkloadColor function to use more bluish colors
const getWorkloadColor = (workload: number) => {
  if (workload > 80) return "bg-blue-600"
  if (workload > 60) return "bg-blue-400"
  return "bg-blue-300"
}

// Update the getPriorityColor function to use more greyish-bluish colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "medium":
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
    case "low":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

export function TeamWorkloadView() {
  return (
    <div className="space-y-6">
      {teamMembers.map((member) => (
        <div key={member.id} className="rounded-lg border p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Workload</span>
                <span className="text-sm font-medium">{member.workload}%</span>
              </div>
              <Progress value={member.workload} className={`h-2 ${getWorkloadColor(member.workload)}`} />
              <div className="flex flex-wrap gap-1">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="min-w-[250px] space-y-2">
              <h4 className="text-sm font-medium">Current Tasks ({member.tasks.length})</h4>
              {member.tasks.map((task) => (
                <div key={task.name} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span>{task.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
