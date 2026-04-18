"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { useTasks, useUpdateTaskStatus } from "@/lib/api/hooks/useTasks"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Task, TaskStatus } from "@/lib/api/types/tasks"

// Function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950 dark:border-rose-800"
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const { toast } = useToast()

  // Fetch all tasks
  const { data, isLoading, isError, error, refetch } = useTasks()

  // Task status update mutation
  const updateTaskStatus = useUpdateTaskStatus()

  // Filter tasks by status
  const todoTasks = data?.data.filter((task) => task.status === "todo") || []
  const inProgressTasks = data?.data.filter((task) => task.status === "in-progress") || []
  const completedTasks = data?.data.filter((task) => task.status === "completed") || []
  const blockedTasks = data?.data.filter((task) => task.status === "blocked") || []
  const onHoldTasks = data?.data.filter((task) => task.status === "on-hold") || []
  const cancelledTasks = data?.data.filter((task) => task.status === "cancelled") || []

  const openTaskDialog = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")

    if (!taskId) {
      return
    }

    const currentTask = data?.data.find((task) => task.id === taskId)
    if (!currentTask || currentTask.status === status) {
      return
    }

    const previousStatus = currentTask.status
    const isOffline = typeof window !== "undefined" && !window.navigator.onLine

    // Update task status via API
    updateTaskStatus.mutate(
      { id: taskId, status },
      {
        onSuccess: () => {
          toast({
            title: isOffline ? "Status change queued" : "Task moved",
            description: isOffline
              ? "You are offline. The status update will sync automatically when connection is restored."
              : "Task status updated successfully.",
            action: (
              <ToastAction
                altText="Undo task move"
                onClick={() => updateTaskStatus.mutate({ id: taskId, status: previousStatus })}
              >
                Undo
              </ToastAction>
            ),
          })
        },
        onError: () => {
          toast({
            title: "Failed to move task",
            description: "The task status was restored to its previous column.",
            variant: "destructive",
          })
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Kanban Board</CardTitle>
          <CardDescription>Visualize your workflow with drag-and-drop task management</CardDescription>
        </div>
        <Button onClick={() => { setSelectedTask(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState message="Loading tasks..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading tasks: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetch()}
          />
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="There are no tasks in the system."
            action={
              <Button onClick={() => { setSelectedTask(undefined); setIsDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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

          {/* Blocked Column */}
          <div
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "blocked")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">Blocked ({blockedTasks.length})</h3>
            </div>
            {blockedTasks.map((task) => (
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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

          {/* On Hold Column */}
          <div
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "on-hold")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">On Hold ({onHoldTasks.length})</h3>
            </div>
            {onHoldTasks.map((task) => (
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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

          {/* Cancelled Column */}
          <div
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "cancelled")}
          >
            <div className="rounded-lg bg-muted p-3">
              <h3 className="font-medium">Cancelled ({cancelledTasks.length})</h3>
            </div>
            {cancelledTasks.map((task) => (
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
                        <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                        <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
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
        )}
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
