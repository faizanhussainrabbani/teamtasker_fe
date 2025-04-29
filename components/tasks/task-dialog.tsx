"use client"

import { useState, useEffect } from "react"
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

import { useUsers } from "@/lib/api/hooks/useUsers"
import { useTeams, useTeam } from "@/lib/api/hooks/useTeams"

// Sample team members for assignee selection (fallback)
const sampleTeamMembers = [
  {
    id: "user-1",
    name: "Jane Doe",
    role: "Senior Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JD",
  },
  {
    id: "user-2",
    name: "John Smith",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JS",
  },
]

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
  task?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const isNewTask = !task

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    progress: 0,
    assigneeId: "",
    teamMemberId: undefined as number | undefined,
    assignmentType: "direct" as "direct" | "team", // "direct" for assigneeId, "team" for teamMemberId
    tags: [] as string[],
  })

  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (task) {
      // Determine assignment type based on existing task data
      const assignmentType = task.teamMemberId ? "team" : "direct";

      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
        progress: task.progress || 0,
        assigneeId: task.assignee?.id || "",
        teamMemberId: task.teamMemberId,
        assignmentType,
        tags: task.tags || [],
      })
    } else {
      // Default values for new task
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        progress: 0,
        assigneeId: "",
        teamMemberId: undefined,
        assignmentType: "direct",
        tags: [],
      })
    }
  }, [task])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  // Component for selecting a user directly
  function AssignToUserSelect({ value, onChange }: { value: string, onChange: (value: string) => void }) {
    // Fetch users
    const { data: usersData, isLoading: usersLoading } = useUsers();
    const users = usersData?.items || sampleTeamMembers;

    return (
      <div className="space-y-2">
        <Label htmlFor="assignee">Assign to User</Label>
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger id="assignee">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials || user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {usersLoading && <p className="text-xs text-muted-foreground">Loading users...</p>}
      </div>
    );
  }

  // Component for selecting a team member
  function AssignToTeamMemberSelect({ value, onChange }: { value: number | undefined, onChange: (value: number | undefined) => void }) {
    // Fetch teams
    const { data: teamsData, isLoading: teamsLoading } = useTeams();
    const teams = teamsData?.items || [];

    // State for selected team
    const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);

    // Fetch team details including members when a team is selected
    const { data: teamDetails, isLoading: teamDetailsLoading } = useTeam(selectedTeam || 0);
    const teamMembers = teamDetails?.members || [];

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team">Select Team</Label>
          <Select
            value={selectedTeam?.toString() || ""}
            onValueChange={(value) => {
              setSelectedTeam(value ? parseInt(value) : undefined);
              // Reset team member selection when team changes
              onChange(undefined);
            }}
          >
            <SelectTrigger id="team">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No team</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {teamsLoading && <p className="text-xs text-muted-foreground">Loading teams...</p>}
        </div>

        {selectedTeam && (
          <div className="space-y-2">
            <Label htmlFor="teamMember">Select Team Member</Label>
            <Select
              value={value?.toString() || ""}
              onValueChange={(value) => onChange(value ? parseInt(value) : undefined)}
              disabled={teamDetailsLoading || teamMembers.length === 0}
            >
              <SelectTrigger id="teamMember">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.user.avatar} alt={member.user.name} />
                        <AvatarFallback>
                          {member.user.initials || member.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span>{member.user.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({member.role})</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {teamDetailsLoading && <p className="text-xs text-muted-foreground">Loading team members...</p>}
            {!teamDetailsLoading && teamMembers.length === 0 && (
              <p className="text-xs text-muted-foreground">No members in this team</p>
            )}
          </div>
        )}
      </div>
    );
  }

  const handleSubmit = () => {
    // Prepare the data for submission
    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      progress: formData.progress,
      tags: formData.tags,
    };

    // Add the appropriate assignment field based on assignment type
    if (formData.assignmentType === "direct") {
      Object.assign(taskData, { assigneeId: formData.assigneeId || undefined });
    } else {
      Object.assign(taskData, { teamMemberId: formData.teamMemberId });
    }

    // Here you would typically save the task data
    console.log("Saving task:", taskData);
    onOpenChange(false);
  }

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
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignmentType">Assignment Type</Label>
                <Select
                  value={formData.assignmentType}
                  onValueChange={(value) => handleChange("assignmentType", value as "direct" | "team")}
                >
                  <SelectTrigger id="assignmentType">
                    <SelectValue placeholder="Select assignment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct User Assignment</SelectItem>
                    <SelectItem value="team">Team Member Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.assignmentType === "direct" ? (
              <AssignToUserSelect
                value={formData.assigneeId}
                onChange={(value) => handleChange("assigneeId", value)}
              />
            ) : (
              <AssignToTeamMemberSelect
                value={formData.teamMemberId}
                onChange={(value) => handleChange("teamMemberId", value)}
              />
            )}
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
                onChange={(e) => handleChange("progress", parseInt(e.target.value))}
              />
              <Progress value={formData.progress} className="h-2" />
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
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
            {isNewTask ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
