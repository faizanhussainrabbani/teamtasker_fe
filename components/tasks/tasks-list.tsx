"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SortAsc,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Update the getStatusIcon function to use blue colors
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-400" />
    case "todo":
      return <Circle className="h-5 w-5 text-gray-400" />
    default:
      return <AlertCircle className="h-5 w-5 text-blue-300" />
  }
}

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

export function TasksList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTaskDialog = (task: any) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and track your team's tasks</CardDescription>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SortAsc className="mr-2 h-4 w-4" />
                  <span>Priority</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                onClick={() => openTaskDialog(task)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox checked={task.status === "completed"} />
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="hidden text-xs text-muted-foreground md:block">{task.description}</div>
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
                  <div className="hidden items-center gap-2 md:flex">
                    {task.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="hidden w-32 md:block">
                    <div className="flex items-center justify-between text-xs">
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
