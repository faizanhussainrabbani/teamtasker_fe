"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { TaskDialog } from "@/components/tasks/task-dialog"

// Sample task data
const tasks = [
  {
    id: "task-1",
    title: "API Integration",
    description: "Integrate the new payment gateway API with our checkout system",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-05-15",
    progress: 45,
    assignee: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    tags: ["Backend", "API"],
  },
  {
    id: "task-2",
    title: "User Dashboard Redesign",
    description: "Redesign the user dashboard for better UX and accessibility",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-05-18",
    progress: 30,
    assignee: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    tags: ["UI/UX", "Frontend"],
  },
  {
    id: "task-3",
    title: "Database Optimization",
    description: "Optimize database queries for better performance",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-20",
    progress: 0,
    assignee: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    tags: ["Database", "Performance"],
  },
  {
    id: "task-4",
    title: "Documentation Update",
    description: "Update API documentation with new endpoints",
    status: "completed",
    priority: "low",
    dueDate: "2023-05-10",
    progress: 100,
    assignee: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    tags: ["Documentation"],
  },
  {
    id: "task-5",
    title: "Security Audit",
    description: "Perform security audit on authentication system",
    status: "todo",
    priority: "high",
    dueDate: "2023-05-25",
    progress: 0,
    assignee: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    tags: ["Security", "Audit"],
  },
]

// Function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
    case "medium":
      return "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
    case "low":
      return "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
    default:
      return ""
  }
}

export function TasksCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const openTaskDialog = (task: any) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  // Group tasks by date
  const tasksByDate: Record<string, any[]> = {}
  tasks.forEach((task) => {
    const dateStr = task.dueDate
    if (!tasksByDate[dateStr]) {
      tasksByDate[dateStr] = []
    }
    tasksByDate[dateStr].push(task)
  })

  // Get tasks for selected date
  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""
  const tasksForSelectedDate = tasksByDate[selectedDateStr] || []

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>View tasks by due date</CardDescription>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[1fr_300px]">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {date ? date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "No date selected"}
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                  if (date) {
                    const newDate = new Date(date)
                    newDate.setDate(newDate.getDate() - 1)
                    setDate(newDate)
                  }
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                  if (date) {
                    const newDate = new Date(date)
                    newDate.setDate(newDate.getDate() + 1)
                    setDate(newDate)
                  }
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-2">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border p-3 text-sm"
                    onClick={() => openTaskDialog(task)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{task.title}</div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No tasks due on this date</p>
                  <Button variant="outline" className="mt-2" onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {isDialogOpen && (
        <TaskDialog
          task={selectedTask}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </Card>
  )
}
