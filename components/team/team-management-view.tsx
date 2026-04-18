"use client"

import { useEffect, useMemo, useState } from "react"
import { Edit3, Plus, ShieldCheck, Trash2, UserMinus, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"
import { TeamDialog } from "@/components/team/team-dialog"
import {
  useAddTeamMember,
  useCreateTeam,
  useDeleteTeam,
  useRemoveTeamMember,
  useTeam,
  useTeams,
  useUpdateTeam,
} from "@/lib/api/hooks/useTeams"
import { useUsers } from "@/lib/api/hooks/useUsers"
import { Team, TeamCreateRequest } from "@/lib/api/types/teams"
import { User } from "@/lib/api/types/users"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

const TEAM_ROLE_OPTIONS = ["Member", "Contributor", "Lead"]
const EMPTY_TEAMS: Team[] = []
const EMPTY_USERS: User[] = []

export function TeamManagementView() {
  const { user } = useAuth()
  const { toast } = useToast()

  const isAdmin = (user?.role || "").toLowerCase() === "admin"

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedTeamId, setSelectedTeamId] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined)

  const [memberUserId, setMemberUserId] = useState("")
  const [memberRole, setMemberRole] = useState(TEAM_ROLE_OPTIONS[0] || "Member")

  const teamsQuery = useTeams({
    pageNumber: 1,
    pageSize: 100,
    searchTerm: searchTerm || undefined,
    department: departmentFilter === "all" ? undefined : departmentFilter,
  })

  const usersQuery = useUsers({
    pageNumber: 1,
    pageSize: 100,
  })

  const selectedTeamQuery = useTeam(selectedTeamId)

  const createTeamMutation = useCreateTeam()
  const updateTeamMutation = useUpdateTeam()
  const deleteTeamMutation = useDeleteTeam()
  const addMemberMutation = useAddTeamMember()
  const removeMemberMutation = useRemoveTeamMember()

  const teams = useMemo(() => teamsQuery.data?.data ?? EMPTY_TEAMS, [teamsQuery.data?.data])
  const users = useMemo(() => usersQuery.data?.data ?? EMPTY_USERS, [usersQuery.data?.data])

  useEffect(() => {
    if (teams.length === 0) {
      setSelectedTeamId("")
      return
    }

    if (!selectedTeamId) {
      setSelectedTeamId(teams[0]?.id || "")
      return
    }

    const selectedStillExists = teams.some((team) => team.id === selectedTeamId)
    if (!selectedStillExists) {
      setSelectedTeamId(teams[0]?.id || "")
    }
  }, [teams, selectedTeamId])

  const departmentOptions = useMemo(() => {
    return Array.from(
      new Set(
        teams
          .map((team) => team.department)
          .filter((department) => Boolean(department))
          .map((department) => department.trim()),
      ),
    ).sort((a, b) => a.localeCompare(b))
  }, [teams])

  const selectedTeam = selectedTeamQuery.data

  const availableUsersForSelectedTeam = useMemo(() => {
    if (!selectedTeam) {
      return []
    }

    const existingIds = new Set(selectedTeam.members.map((member) => member.userId))
    return users.filter((candidate) => !existingIds.has(candidate.id))
  }, [selectedTeam, users])

  const openCreateDialog = () => {
    setEditingTeam(undefined)
    setIsDialogOpen(true)
  }

  const openEditDialog = (team: Team) => {
    setEditingTeam(team)
    setIsDialogOpen(true)
  }

  const handleSubmitTeam = async (payload: TeamCreateRequest) => {
    try {
      if (editingTeam) {
        const updatedTeam = await updateTeamMutation.mutateAsync({
          id: editingTeam.id,
          ...payload,
        })

        setSelectedTeamId(updatedTeam.id)
        toast({
          title: "Team updated",
          description: "Team details were updated successfully.",
        })
      } else {
        const createdTeam = await createTeamMutation.mutateAsync(payload)
        setSelectedTeamId(createdTeam.id)
        toast({
          title: "Team created",
          description: "New team is now available in your workspace.",
        })
      }

      setIsDialogOpen(false)
    } catch {
      toast({
        title: editingTeam ? "Failed to update team" : "Failed to create team",
        description: "Please review inputs and try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTeam = async (team: Team) => {
    if (!isAdmin) {
      toast({
        title: "Admin access required",
        description: "Only admins can delete teams.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Delete team \"${team.name}\"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteTeamMutation.mutateAsync(team.id)
      toast({
        title: "Team deleted",
        description: "Team was removed successfully.",
      })
    } catch {
      toast({
        title: "Failed to delete team",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddMember = async () => {
    if (!selectedTeamId || !memberUserId) {
      return
    }

    try {
      await addMemberMutation.mutateAsync({
        teamId: selectedTeamId,
        payload: {
          userId: memberUserId,
          role: memberRole,
        },
      })

      setMemberUserId("")
      setMemberRole(TEAM_ROLE_OPTIONS[0] || "Member")

      toast({
        title: "Member added",
        description: "User was added to the selected team.",
      })
    } catch {
      toast({
        title: "Failed to add member",
        description: "Please verify selection and try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeamId) {
      return
    }

    try {
      await removeMemberMutation.mutateAsync({
        teamId: selectedTeamId,
        userId,
      })

      toast({
        title: "Member removed",
        description: "User was removed from the team.",
      })
    } catch {
      toast({
        title: "Failed to remove member",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Team Directory</CardTitle>
              <CardDescription>Browse and manage cross-functional teams</CardDescription>
            </div>
            {isAdmin ? (
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Team
              </Button>
            ) : null}
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="team-search">Search</Label>
              <Input
                id="team-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find by team name or description"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="team-department-filter">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger id="team-department-filter">
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departmentOptions.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {teamsQuery.isLoading ? (
            <LoadingState message="Loading teams..." />
          ) : teamsQuery.isError ? (
            <ErrorState
              message="Failed to load teams"
              onRetry={() => teamsQuery.refetch()}
            />
          ) : teams.length === 0 ? (
            <EmptyState
              title="No teams found"
              description="Create a team to start organizing members and workloads."
              action={
                isAdmin ? (
                  <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Team
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedTeamId === team.id ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">{team.name}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {team.description || "No description provided"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{team.department || "General"}</Badge>
                        <span>{team.memberCount} members</span>
                        {team.leadName ? <span>Lead: {team.leadName}</span> : null}
                      </div>
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {isAdmin ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={(event) => {
                          event.stopPropagation()
                          openEditDialog(team)
                        }}
                      >
                        <Edit3 className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleDeleteTeam(team)
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Detail</CardTitle>
          <CardDescription>
            {selectedTeamId
              ? "Review lead ownership and membership"
              : "Select a team to inspect details"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!selectedTeamId ? (
            <EmptyState
              title="No team selected"
              description="Select a team from the directory to view its details."
            />
          ) : selectedTeamQuery.isLoading ? (
            <LoadingState message="Loading team details..." />
          ) : selectedTeamQuery.isError ? (
            <ErrorState
              message="Failed to load selected team"
              onRetry={() => selectedTeamQuery.refetch()}
            />
          ) : selectedTeam ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedTeam.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTeam.description || "No description provided."}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{selectedTeam.department || "General"}</Badge>
                  {selectedTeam.leadName ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {selectedTeam.leadName}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No lead assigned</Badge>
                  )}
                </div>
              </div>

              <Separator />

              {isAdmin ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Add Team Member</p>
                  <div className="space-y-2">
                    <Label htmlFor="team-member-user">User</Label>
                    <Select value={memberUserId} onValueChange={setMemberUserId}>
                      <SelectTrigger id="team-member-user">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsersForSelectedTeam.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            {candidate.name || candidate.fullName || candidate.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-member-role">Role</Label>
                    <Select value={memberRole} onValueChange={setMemberRole}>
                      <SelectTrigger id="team-member-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAM_ROLE_OPTIONS.map((roleOption) => (
                          <SelectItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => void handleAddMember()}
                    disabled={!memberUserId || addMemberMutation.isPending}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              ) : null}

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">Members ({selectedTeam.members.length})</p>
                {selectedTeam.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members assigned yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTeam.members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email} • {member.role}
                          </p>
                        </div>
                        {isAdmin ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleRemoveMember(member.userId)}
                            disabled={removeMemberMutation.isPending}
                          >
                            <UserMinus className="mr-2 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <TeamDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        team={editingTeam}
        users={users}
        onSubmit={handleSubmitTeam}
        isSaving={createTeamMutation.isPending || updateTeamMutation.isPending}
      />
    </div>
  )
}
