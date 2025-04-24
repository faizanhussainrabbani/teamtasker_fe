"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, AlertCircle, MoreHorizontal, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTasks, useUpdateTaskStatus } from "@/lib/api/hooks/useTasks"
import { TaskStatus } from "@/lib/api/types/tasks"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

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

interface MyTasksCardProps {
  isLoading?: boolean;
}

export function MyTasksCard({ isLoading: cardIsLoading }: MyTasksCardProps) {
  const [activeTab, setActiveTab] = useState("all")

  // Convert UI filter to API parameter
  const statusFilter = activeTab !== "all" ? activeTab as TaskStatus : undefined

  // Fetch tasks with React Query
  const { data, isLoading: dataIsLoading, isError, error, refetch } = useTasks({ status: statusFilter })

  // Combine loading states
  const isLoading = cardIsLoading || dataIsLoading

  // Task status update mutation
  const updateTaskStatus = useUpdateTaskStatus()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Manage your assigned tasks</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <LoadingState message="Loading tasks..." />
            ) : isError ? (
              <EmptyState
                title="No tasks found"
                description={`You don't have any ${activeTab !== 'all' ? activeTab + ' ' : ''}tasks.`}
                action={
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try Again
                  </Button>
                }
              />
            ) : !data?.data || data.data.length === 0 ? (
              <EmptyState
                title="No tasks found"
                description={`You don't have any ${activeTab !== 'all' ? activeTab + ' ' : ''}tasks.`}
              />
            ) : (
              data.data.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        const newStatus = task.status === "completed" ? "todo" : "completed";
                        updateTaskStatus.mutate({ id: task.id, status: newStatus });
                      }}
                    >
                      {getStatusIcon(task.status)}
                    </div>
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
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
