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
  Trash2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"
import { useTasks, useDeleteTask, useUpdateTaskStatus } from "@/lib/api/hooks/useTasks"
import { TaskStatus, TaskPriority } from "@/lib/api/types/tasks"

// This would be replaced by API data

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
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  // Convert UI filters to API parameters
  const apiParams = {
    status: statusFilter !== "all" ? statusFilter as TaskStatus : undefined,
    priority: priorityFilter !== "all" ? priorityFilter as TaskPriority : undefined,
    search: searchQuery || undefined,
  };

  // Fetch tasks with React Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useTasks(apiParams);

  // Delete task mutation
  const deleteTaskMutation = useDeleteTask();

  // Update task status mutation
  const updateTaskStatusMutation = useUpdateTaskStatus();

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatusMutation.mutate({ id, status });
  };

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

          {isLoading ? (
            <LoadingState message="Loading tasks..." />
          ) : isError ? (
            <ErrorState
              message={`Error loading tasks: ${error?.message || 'Unknown error'}`}
              onRetry={() => refetch()}
            />
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description="There are no tasks matching your filters."
              action={
                <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {data?.data.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm cursor-pointer hover:bg-muted/50"
                  onClick={() => openTaskDialog(task)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(
                          task.id,
                          task.status === "completed" ? "todo" : "completed",
                          e
                        );
                      }}
                    />
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
                      <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                      <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openTaskDialog(task); }}>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleStatusChange(task.id, task.status === "todo" ? "in-progress" : "todo", e)}>
                          {task.status === "todo" ? "Mark as In Progress" : "Mark as To Do"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleStatusChange(task.id, task.status === "completed" ? "in-progress" : "completed", e)}>
                          {task.status === "completed" ? "Mark as In Progress" : "Mark as Completed"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => handleDeleteTask(task.id, e)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
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
