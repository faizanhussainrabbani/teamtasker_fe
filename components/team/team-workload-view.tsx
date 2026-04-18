"use client"

import { useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useUsers } from "@/lib/api/hooks/useUsers"
import { useTasks } from "@/lib/api/hooks/useTasks"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"
import { Task } from "@/lib/api/types/tasks"

const ACTIVE_WORKLOAD_STATUSES = new Set(["todo", "in-progress", "blocked", "on-hold"])

const PRIORITY_WEIGHT: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

interface MemberWorkload {
  id: string
  name: string
  role: string
  avatar?: string
  initials: string
  workload: number
  activeTasks: Task[]
  tags: string[]
}

const normalizeDate = (value?: string) => {
  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp
}

const formatDueDate = (value?: string) => {
  if (!value) {
    return "No due date"
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "No due date" : date.toLocaleDateString()
}

const getTaskAssigneeId = (task: Task) => {
  return task.assigneeId || task.assignee?.id || ""
}

const calculateWorkload = (tasks: Task[]) => {
  const points = tasks.reduce((total, task) => {
    if (!ACTIVE_WORKLOAD_STATUSES.has(task.status)) {
      return total
    }

    return total + (PRIORITY_WEIGHT[task.priority] ?? 1)
  }, 0)

  // 12 weighted points maps to a full workload lane.
  return Math.min(100, Math.round((points / 12) * 100))
}

// Update the getWorkloadColor function to use more bluish colors
const getWorkloadColor = (workload: number) => {
  if (workload > 80) return "bg-blue-600"
  if (workload > 60) return "bg-blue-400"
  return "bg-blue-300"
}

// Update the getPriorityColor function to use more greyish-bluish colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200"
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
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorDetail,
    refetch: refetchUsers,
  } = useUsers({ page: 1, limit: 100 })

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorDetail,
    refetch: refetchTasks,
  } = useTasks({ page: 1, limit: 100 })

  const isLoading = usersLoading || tasksLoading
  const isError = usersError || tasksError

  const members = useMemo<MemberWorkload[]>(() => {
    const users = usersData?.data ?? []
    const tasks = tasksData?.data ?? []

    return users
      .map((user) => {
        const displayName = user.name || user.fullName || user.email
        const fallbackInitials = displayName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0] || "")
          .join("")
          .toUpperCase() || "TT"

        const assignedTasks = tasks
          .filter((task) => getTaskAssigneeId(task) === user.id)
          .sort((a, b) => normalizeDate(a.dueDate) - normalizeDate(b.dueDate))

        const activeTasks = assignedTasks
          .filter((task) => ACTIVE_WORKLOAD_STATUSES.has(task.status))
          .slice(0, 3)

        const workload = calculateWorkload(assignedTasks)
        const tags = [user.department, user.role].filter(Boolean) as string[]

        return {
          id: user.id,
          name: displayName,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials || fallbackInitials,
          workload,
          activeTasks,
          tags,
        }
      })
      .sort((a, b) => b.workload - a.workload)
  }, [usersData?.data, tasksData?.data])

  if (isLoading) {
    return <LoadingState message="Loading team workload..." />
  }

  if (isError) {
    const message = usersError
      ? usersErrorDetail?.message || "Unable to load users"
      : tasksErrorDetail?.message || "Unable to load tasks"

    return (
      <ErrorState
        message={`Error loading workload: ${message}`}
        onRetry={() => {
          refetchUsers()
          refetchTasks()
        }}
      />
    )
  }

  if (members.length === 0) {
    return (
      <EmptyState
        title="No team members found"
        description="Add users and assign tasks to populate workload distribution."
      />
    )
  }

  return (
    <div className="space-y-6">
      {members.map((member) => (
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
                {member.tags.length > 0 ? (
                  member.tags.map((tag) => (
                    <Badge key={`${member.id}-${tag}`} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    General
                  </Badge>
                )}
              </div>
            </div>
            <div className="min-w-[250px] space-y-2">
              <h4 className="text-sm font-medium">Current Tasks ({member.activeTasks.length})</h4>
              {member.activeTasks.length === 0 ? (
                <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                  No active tasks assigned.
                </div>
              ) : (
                member.activeTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span>{task.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDueDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
