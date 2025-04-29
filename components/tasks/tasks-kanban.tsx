"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { useUpdateTaskStatus } from "@/lib/api/hooks/useTasks"
import { useDashboardTasks } from "@/context/tasks-context"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  // Use the enhanced TasksContext
  const {
    getFilteredTasks,
    isLoading,
    isError,
    error
  } = useDashboardTasks();

  // State for the filtered tasks data
  const [tasksData, setTasksData] = useState<any>(null);

  // Store the getFilteredTasks function in a ref to prevent it from causing infinite loops
  const getFilteredTasksRef = React.useRef(getFilteredTasks);

  // Update the ref when getFilteredTasks changes
  React.useEffect(() => {
    getFilteredTasksRef.current = getFilteredTasks;
  }, [getFilteredTasks]);

  // State for local loading
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      setLocalLoading(true);

      try {
        // Use the ref to get the latest function without causing dependency issues
        const result = await getFilteredTasksRef.current({
          includeTags: true,
          includeAssignee: true,
          includeCreator: true,
        });

        // Only update state if component is still mounted
        if (isMounted) {
          setTasksData(result);
          setLocalLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching tasks:", error);
          setLocalLoading(false);
        }
      }
    };

    fetchTasks();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Remove getFilteredTasks from dependencies

  // Task status update mutation
  const updateTaskStatus = useUpdateTaskStatus()

  // Refetch tasks function
  const refetchTasks = async () => {
    setLocalLoading(true);
    try {
      // Use the ref to get the latest function without causing dependency issues
      const result = await getFilteredTasksRef.current({
        includeTags: true,
        includeAssignee: true,
        includeCreator: true,
      });
      setTasksData(result);
      setLocalLoading(false);
    } catch (error) {
      console.error("Error refetching tasks:", error);
      setLocalLoading(false);
    }
  };

  // Filter tasks by status
  const todoTasks = tasksData?.items?.filter((task) => task.status === "todo") || []
  const inProgressTasks = tasksData?.items?.filter((task) => task.status === "in-progress") || []
  const completedTasks = tasksData?.items?.filter((task) => task.status === "completed") || []

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

    // Update task status via API
    updateTaskStatus.mutate({ id: taskId, status })
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
        {localLoading ? (
          <LoadingState message="Loading tasks..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading tasks: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetchTasks()}
          />
        ) : !tasksData?.items || tasksData.items.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="There are no tasks in the system."
            action={
              <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            }
          />
        ) : (
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
        )}
      </CardContent>
      {isDialogOpen && (
        <TaskDialog
          task={selectedTask}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Refetch tasks when dialog is closed to reflect any changes
              refetchTasks();
            }
          }}
        />
      )}
    </Card>
  )
}
