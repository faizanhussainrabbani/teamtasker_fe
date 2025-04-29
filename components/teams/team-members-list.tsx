"use client"

import { useState } from "react"
import { useTeamMembers, useRemoveTeamMember, useUpdateTeamMember } from "@/lib/api/hooks/useTeams"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoadingState, EmptyState } from "@/components/ui/api-state"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, UserMinus, UserCog, Mail } from "lucide-react"
import { toast } from "sonner"
import { TeamMemberRole } from "@/lib/api/types/teams"

interface TeamMembersListProps {
  teamId: number
}

export function TeamMembersList({ teamId }: TeamMembersListProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<TeamMemberRole>("Member")
  
  // Fetch team members
  const { data: members, isLoading, isError, refetch } = useTeamMembers(teamId)
  
  // Remove member mutation
  const removeTeamMemberMutation = useRemoveTeamMember(teamId)
  
  // Update member role mutation
  const updateTeamMemberMutation = useUpdateTeamMember(
    teamId,
    selectedMemberId || 0
  )
  
  // Handle member removal
  const handleRemoveMember = async () => {
    if (!selectedMemberId) return
    
    try {
      await removeTeamMemberMutation.mutateAsync(selectedMemberId)
      toast.success("Team member removed successfully")
      setIsRemoveDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error("Failed to remove team member")
      console.error("Error removing team member:", error)
    }
  }
  
  // Handle role update
  const handleUpdateRole = async () => {
    if (!selectedMemberId) return
    
    try {
      await updateTeamMemberMutation.mutateAsync(selectedRole)
      toast.success("Member role updated successfully")
      setIsRoleDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error("Failed to update member role")
      console.error("Error updating member role:", error)
    }
  }
  
  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "lead":
        return "default"
      case "admin":
        return "secondary"
      default:
        return "outline"
    }
  }
  
  if (isLoading) {
    return <LoadingState message="Loading team members..." />
  }
  
  if (isError) {
    return (
      <EmptyState
        title="Error loading members"
        description="There was a problem loading the team members."
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        }
      />
    )
  }
  
  if (!members || members.length === 0) {
    return (
      <EmptyState
        title="No team members"
        description="This team doesn't have any members yet."
      />
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="font-medium">Member</div>
            <div className="text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y">
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user.avatar} alt={member.user.name} />
                  <AvatarFallback>{member.user.initials || member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.user.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{member.user.email}</span>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMemberId(member.id)
                        setSelectedRole(member.role as TeamMemberRole)
                        setIsRoleDialogOpen(true)
                      }}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        window.location.href = `mailto:${member.user.email}`
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedMemberId(member.id)
                        setIsRemoveDialogOpen(true)
                      }}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove from Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the team?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRemoveMember}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update the role of this team member.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as TeamMemberRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
