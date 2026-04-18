"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Team, TeamCreateRequest } from "@/lib/api/types/teams"
import { User } from "@/lib/api/types/users"

interface TeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
  users: User[]
  onSubmit: (payload: TeamCreateRequest) => Promise<void>
  isSaving: boolean
}

type FormErrors = {
  name?: string
  description?: string
  department?: string
}

export function TeamDialog({
  open,
  onOpenChange,
  team,
  users,
  onSubmit,
  isSaving,
}: TeamDialogProps) {
  const isEdit = Boolean(team)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("")
  const [leadId, setLeadId] = useState("none")
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) {
      return
    }

    setName(team?.name ?? "")
    setDescription(team?.description ?? "")
    setDepartment(team?.department ?? "")
    setLeadId(team?.leadId ?? "none")
    setErrors({})
  }, [open, team])

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}

    if (!name.trim()) {
      nextErrors.name = "Team name is required."
    } else if (name.trim().length > 100) {
      nextErrors.name = "Team name must not exceed 100 characters."
    }

    if (description.trim().length > 500) {
      nextErrors.description = "Description must not exceed 500 characters."
    }

    if (department.trim().length > 100) {
      nextErrors.department = "Department must not exceed 100 characters."
    }

    return nextErrors
  }

  const handleSubmit = async () => {
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      department: department.trim() || undefined,
      leadId: leadId === "none" ? undefined : leadId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Team" : "Create Team"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update team details and ownership."
              : "Create a new team and assign an optional lead."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              placeholder="Platform Engineering"
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)
                setErrors((prev) => ({ ...prev, description: undefined }))
              }}
              className="min-h-[90px]"
              placeholder="Owns delivery velocity, technical standards, and release quality."
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-department">Department</Label>
            <Input
              id="team-department"
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value)
                setErrors((prev) => ({ ...prev, department: undefined }))
              }}
              placeholder="Engineering"
            />
            {errors.department ? (
              <p className="text-sm text-destructive">{errors.department}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-lead">Team Lead</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger id="team-lead">
                <SelectValue placeholder="Select an optional lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No lead assigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.fullName || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
