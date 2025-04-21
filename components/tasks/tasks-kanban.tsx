"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/tasks/task-dialog"

// Sample task data
const initialTasks = [
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
  {
    id: "task-6",
    title: "Mobile Responsiveness",
    description: "Fix mobile responsiveness issues on checkout page",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-22",
    progress: 0,
    assignee: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    tags: ["Frontend", "Mobile"],
  },
  {
    id: "task-7",
    title: "User Testing",
    description: "Conduct user testing for the new feature",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-28",
    progress: 0,
    assignee: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    tags: ["Testing", "UX"],
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

export function TasksKanban() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const openTaskDialog = (task: any) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status }
        }
        return task
      })
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Kanban Board</CardTitle>
          <CardDescription>Visualize your workflow with drag-and-drop task management</CardDescription>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* To Do Column */}
          <div 
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "todo")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">To Do ({todoTasks.length})</h3>
            </div>
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-card p-3 shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => openTaskDialog(task)}
              >
                <div className="space-y-2">
                  <div className="font-medium">{task.title}</div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* In Progress Column */}
          <div 
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "in-progress")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">In Progress ({inProgressTasks.length})</h3>
            </div>
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-card p-3 shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => openTaskDialog(task)}
              >
                <div className="space-y-2">
                  <div className="font-medium">{task.title}</div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Completed Column */}
          <div 
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "completed")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">Completed ({completedTasks.length})</h3>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-card p-3 shadow-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => openTaskDialog(task)}
              >
                <div className="space-y-2">
                  <div className="font-medium">{task.title}</div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full border border-dashed">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
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
