"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { useCreateTask, useUpdateTask } from "@/lib/api/hooks/useTasks"
import { useUsers } from "@/lib/api/hooks/useUsers"
import { Task, TaskPriority, TaskStatus, TaskUpdateRequest } from "@/lib/api/types/tasks"
import { parseApiError } from "@/lib/error-handling"
import { useToast } from "@/components/ui/use-toast"

// Sample tags for selection
const availableTags = [
  "Frontend",
  "Backend",
  "API",
  "UI/UX",
  "Database",
  "Performance",
  "Security",
  "Documentation",
  "Testing",
  "Mobile",
  "Audit",
]

interface TaskDialogProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormErrors = Partial<Record<"title" | "description" | "dueDate" | "assigneeId" | "tags" | "progress" | "general", string>>

const normalizeDueDate = (dueDate?: string): string => {
  if (!dueDate) {
    return new Date().toISOString().split("T")[0] || ""
  }

  const parsed = new Date(dueDate)
  if (Number.isNaN(parsed.getTime())) {
    return dueDate.split("T")[0] || ""
  }

  return parsed.toISOString().split("T")[0] || ""
}

const normalizeAssigneeId = (assigneeId: unknown): string => {
  if (assigneeId === null || assigneeId === undefined) {
    return ""
  }

  return String(assigneeId)
}

const clampProgress = (progress: number): number => {
  if (progress < 0) {
    return 0
  }

  if (progress > 100) {
    return 100
  }

  return progress
}

const normalizeProgressForStatus = (status: TaskStatus, progress: number): number => {
  const safeProgress = clampProgress(progress)

  if (status === "todo") {
    return 0
  }

  if (status === "completed") {
    return 100
  }

  if (status === "in-progress") {
    if (safeProgress <= 0) {
      return 10
    }

    if (safeProgress >= 100) {
      return 90
    }

    return safeProgress
  }

  if ((status === "blocked" || status === "on-hold" || status === "cancelled") && safeProgress >= 100) {
    return 90
  }

  return safeProgress
}

const normalizeStatusForProgress = (progress: number, currentStatus: TaskStatus): TaskStatus => {
  const safeProgress = clampProgress(progress)

  if (safeProgress === 0) {
    return "todo"
  }

  if (safeProgress === 100) {
    return "completed"
  }

  if (currentStatus === "todo" || currentStatus === "completed") {
    return "in-progress"
  }

  return currentStatus
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const isNewTask = !task
  const { toast } = useToast()

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const { data: usersData } = useUsers({ page: 1, limit: 100 })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    progress: 0,
    assigneeId: "",
    tags: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (task) {
      const status = (task.status || "todo") as TaskStatus
      const progress = typeof task.progress === "number" ? task.progress : 0

      setFormData({
        title: task.title || "",
        description: task.description || "",
        status,
        priority: task.priority || "medium",
        dueDate: normalizeDueDate(task.dueDate),
        progress: normalizeProgressForStatus(status, progress),
        assigneeId: normalizeAssigneeId(task.assigneeId || task.assignee?.id),
        tags: task.tags || [],
      })
    } else {
      // Default values for new task
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: normalizeDueDate(),
        progress: 0,
        assigneeId: "",
        tags: [],
      })
    }

    setFieldErrors({})
  }, [task])

  const handleChange = (field: string, value: string | number) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field as keyof FormErrors]: undefined,
      general: undefined,
    }))

    setFormData((prev) => {
      if (field === "status") {
        const status = value as TaskStatus
        return {
          ...prev,
          status,
          progress: normalizeProgressForStatus(status, prev.progress),
        }
      }

      if (field === "progress") {
        const nextProgress = clampProgress(typeof value === "number" ? value : Number.parseInt(String(value), 10) || 0)

        return {
          ...prev,
          progress: nextProgress,
          status: normalizeStatusForProgress(nextProgress, prev.status as TaskStatus),
        }
      }

      return { ...prev, [field]: value }
    })
  }

  const handleAddTag = () => {
    const candidateTag = newTag.trim()

    if (!candidateTag) {
      return
    }

    if (candidateTag.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        tags: "Each tag must not exceed 50 characters.",
      }))
      return
    }

    if (formData.tags.length >= 20) {
      setFieldErrors((prev) => ({
        ...prev,
        tags: "A task can have at most 20 tags.",
      }))
      return
    }

    if (!formData.tags.includes(candidateTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, candidateTag] }))
      setNewTag("")
      setFieldErrors((prev) => ({ ...prev, tags: undefined }))
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
    setFieldErrors((prev) => ({ ...prev, tags: undefined }))
  }

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {}

    const normalizedTitle = formData.title.trim()
    const normalizedDescription = formData.description.trim()

    if (!normalizedTitle) {
      nextErrors.title = "Title is required."
    } else if (normalizedTitle.length > 100) {
      nextErrors.title = "Title must not exceed 100 characters."
    }

    if (normalizedDescription.length > 500) {
      nextErrors.description = "Description must not exceed 500 characters."
    }

    if (formData.dueDate && Number.isNaN(new Date(formData.dueDate).getTime())) {
      nextErrors.dueDate = "Invalid due date value."
    }

    if (formData.assigneeId && !/^\d+$/.test(String(formData.assigneeId))) {
      nextErrors.assigneeId = "AssigneeId must be numeric."
    }

    if (formData.tags.length > 20) {
      nextErrors.tags = "A task can have at most 20 tags."
    }

    if (formData.tags.some((tag) => tag.length > 50)) {
      nextErrors.tags = "Each tag must not exceed 50 characters."
    }

    if (formData.progress < 0 || formData.progress > 100) {
      nextErrors.progress = "Progress must be between 0 and 100."
    }

    return nextErrors
  }

  const mapApiValidationErrors = (details: unknown): FormErrors => {
    if (!details || typeof details !== "object" || Array.isArray(details)) {
      return {}
    }

    const nextErrors: FormErrors = {}

    Object.entries(details as Record<string, unknown>).forEach(([key, value]) => {
      const firstMessage = Array.isArray(value)
        ? String(value[0] || "")
        : typeof value === "string"
          ? value
          : ""

      if (!firstMessage) {
        return
      }

      const normalizedKey = key.toLowerCase()

      if (normalizedKey.includes("title")) {
        nextErrors.title = firstMessage
      } else if (normalizedKey.includes("description")) {
        nextErrors.description = firstMessage
      } else if (normalizedKey.includes("duedate")) {
        nextErrors.dueDate = firstMessage
      } else if (normalizedKey.includes("assignee")) {
        nextErrors.assigneeId = firstMessage
      } else if (normalizedKey.includes("tag")) {
        nextErrors.tags = firstMessage
      } else if (normalizedKey.includes("progress")) {
        nextErrors.progress = firstMessage
      } else {
        nextErrors.general = firstMessage
      }
    })

    return nextErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setFieldErrors({})

    const basePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status as TaskStatus,
      priority: formData.priority as TaskPriority,
      dueDate: formData.dueDate || undefined,
      assigneeId: normalizeAssigneeId(formData.assigneeId) || undefined,
      tags: formData.tags,
    }

    try {
      if (isNewTask) {
        await createTaskMutation.mutateAsync(basePayload)
      } else {
        const taskUpdatePayload: TaskUpdateRequest = {
          ...basePayload,
          progress: formData.progress,
        }

        await updateTaskMutation.mutateAsync({
          id: task.id,
          task: taskUpdatePayload,
        })
      }

      toast({
        title: isNewTask ? "Task created" : "Task updated",
        description: isNewTask
          ? "The task has been created successfully."
          : "Your task changes have been saved.",
      })

      onOpenChange(false)
    } catch (error) {
      const parsedError = parseApiError(error)
      const mappedErrors = mapApiValidationErrors(parsedError.details)
      if (Object.keys(mappedErrors).length > 0) {
        setFieldErrors(mappedErrors)
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: parsedError.message,
        }))
      }

      toast({
        title: isNewTask ? "Failed to create task" : "Failed to update task",
        description: Object.keys(mappedErrors).length > 0
          ? "Please fix the highlighted fields and try again."
          : parsedError.message,
        variant: "destructive",
      })
    }
  }

  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending
  const assigneeOptions = usersData?.data || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewTask ? "Create New Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {isNewTask
              ? "Add a new task to your project"
              : "Make changes to the existing task"}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
              />
              {fieldErrors.title ? <p className="text-sm text-destructive">{fieldErrors.title}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the task"
                className="min-h-[100px]"
              />
              {fieldErrors.description ? <p className="text-sm text-destructive">{fieldErrors.description}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
                {fieldErrors.dueDate ? <p className="text-sm text-destructive">{fieldErrors.dueDate}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assigneeId || "__none__"}
                  onValueChange={(value) => handleChange("assigneeId", value === "__none__" ? "" : value)}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {assigneeOptions.map((member) => {
                      const memberId = String(member.id)

                      return (
                        <SelectItem key={memberId} value={memberId}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {fieldErrors.assigneeId ? <p className="text-sm text-destructive">{fieldErrors.assigneeId}</p> : null}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={(e) => handleChange("progress", parseInt(e.target.value, 10))}
              />
              <Progress value={formData.progress} className="h-2" />
              {fieldErrors.progress ? <p className="text-sm text-destructive">{fieldErrors.progress}</p> : null}
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newTag} onValueChange={setNewTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags
                      .filter((tag) => !formData.tags.includes(tag))
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTag} disabled={!newTag}>
                  Add Tag
                </Button>
              </div>
              {fieldErrors.tags ? <p className="text-sm text-destructive">{fieldErrors.tags}</p> : null}
            </div>
          </TabsContent>
        </Tabs>
        {fieldErrors.general ? <p className="text-sm text-destructive">{fieldErrors.general}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || isSaving}>
            {isSaving ? "Saving..." : isNewTask ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
