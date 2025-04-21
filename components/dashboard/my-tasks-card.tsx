"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, AlertCircle, MoreHorizontal, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample task data
const tasks = [
  {
    id: "task-1",
    title: "API Integration",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-05-15",
    progress: 45,
    tags: ["Backend", "API"],
  },
  {
    id: "task-2",
    title: "User Dashboard Redesign",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-05-18",
    progress: 30,
    tags: ["UI/UX", "Frontend"],
  },
  {
    id: "task-3",
    title: "Database Optimization",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-20",
    progress: 0,
    tags: ["Database", "Performance"],
  },
  {
    id: "task-4",
    title: "Documentation Update",
    status: "completed",
    priority: "low",
    dueDate: "2023-05-10",
    progress: 100,
    tags: ["Documentation"],
  },
  {
    id: "task-5",
    title: "Security Audit",
    status: "todo",
    priority: "high",
    dueDate: "2023-05-25",
    progress: 0,
    tags: ["Security", "Audit"],
  },
]

// Update the getStatusIcon function to use blue colors
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-blue-500" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-400" />
    case "todo":
      return <Circle className="h-5 w-5 text-gray-400" />
    default:
      return <AlertCircle className="h-5 w-5 text-blue-300" />
  }
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

export function MyTasksCard() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "todo") return task.status === "todo"
    if (activeTab === "in-progress") return task.status === "in-progress"
    if (activeTab === "completed") return task.status === "completed"
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Manage your assigned tasks</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-32 md:block">
                    <div className="flex items-center justify-between text-xs">
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                  <div className="flex gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                      <DropdownMenuItem>Add Comment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
