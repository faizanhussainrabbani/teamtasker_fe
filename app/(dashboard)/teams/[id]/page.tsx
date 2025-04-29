"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTeam, useDeleteTeam } from "@/lib/api/hooks/useTeams"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingState, EmptyState } from "@/components/ui/api-state"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamMembersList } from "@/components/teams/team-members-list"
import { EditTeamDialog } from "@/components/teams/edit-team-dialog"
import { AddTeamMemberDialog } from "@/components/teams/add-team-member-dialog"

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const teamId = parseInt(params.id)
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Fetch team data
  const { data: team, isLoading, isError, refetch } = useTeam(teamId)
  
  // Delete team mutation
  const deleteTeamMutation = useDeleteTeam()
  
  // Handle team deletion
  const handleDeleteTeam = async () => {
    try {
      await deleteTeamMutation.mutateAsync(teamId)
      router.push("/teams")
    } catch (error) {
      console.error("Error deleting team:", error)
    }
  }
  
  return (
    <DashboardShell>
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => router.push("/teams")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>
      
      {isLoading ? (
        <LoadingState message="Loading team details..." />
      ) : isError ? (
        <EmptyState
          title="Error loading team"
          description="There was a problem loading the team details. Please try again."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          }
        />
      ) : !team ? (
        <EmptyState
          title="Team not found"
          description="The team you're looking for doesn't exist or you don't have access to it."
          action={
            <Button variant="outline" onClick={() => router.push("/teams")}>
              Go to Teams
            </Button>
          }
        />
      ) : (
        <>
          <DashboardHeader
            heading={team.name}
            description={team.description || "No description provided."}
            action={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Team
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Team
                </Button>
              </div>
            }
          />
          
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>Details about this team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Department</h3>
                  <p className="text-sm text-muted-foreground">{team.department || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Team Lead</h3>
                  <p className="text-sm text-muted-foreground">
                    {team.lead?.name || "No lead assigned"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Members</h3>
                  <p className="text-sm text-muted-foreground">{team.memberCount || 0} members</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>People in this team</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAddMemberDialogOpen(true)}>
                  Add Member
                </Button>
              </CardHeader>
              <CardContent>
                <TeamMembersList teamId={teamId} />
              </CardContent>
            </Card>
          </div>
          
          {/* Edit Team Dialog */}
          <EditTeamDialog
            team={team}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={() => {
              refetch()
              setIsEditDialogOpen(false)
            }}
          />
          
          {/* Add Team Member Dialog */}
          <AddTeamMemberDialog
            teamId={teamId}
            open={isAddMemberDialogOpen}
            onOpenChange={setIsAddMemberDialogOpen}
            onSuccess={() => {
              refetch()
              setIsAddMemberDialogOpen(false)
            }}
          />
          
          {/* Delete Team Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this team?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the team
                  and remove all members from it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteTeam}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </DashboardShell>
  )
}
