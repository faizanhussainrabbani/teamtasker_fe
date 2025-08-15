"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTeams, useMyTeams } from "@/lib/api/hooks/useTeams"
import { TeamDto } from "@/lib/api/types/teams"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingState, EmptyState } from "@/components/ui/api-state"
import { PlusCircle, Search, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamCard } from "@/components/teams/team-card"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"

export default function TeamsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Fetch all teams data
  const { data: allTeamsData, isLoading: allTeamsLoading, isError: allTeamsError, refetch: refetchAllTeams } = useTeams({
    search: searchQuery || undefined
  }) as {
    data: TeamDto[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  }

  // Fetch my teams data - only when the tab is active
  const { data: myTeamsData, isLoading: myTeamsLoading, isError: myTeamsError, refetch: refetchMyTeams } = useMyTeams() as {
    data: TeamDto[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  }

  // Determine which data to use based on active tab
  const isLoading = activeTab === "all" ? allTeamsLoading : myTeamsLoading
  const isError = activeTab === "all" ? allTeamsError : myTeamsError
  const teamsData = activeTab === "all" ? allTeamsData : myTeamsData
  const refetch = activeTab === "all" ? refetchAllTeams : refetchMyTeams



  // Filter teams based on search query
  const filteredTeams: TeamDto[] = teamsData?.filter(team =>
    !searchQuery || team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.department?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Teams"
        description="Manage your teams and team members."
        action={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Team
          </Button>
        }
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search teams..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Teams</TabsTrigger>
            <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <LoadingState message="Loading teams..." />
            ) : isError ? (
              <EmptyState
                title="Error loading teams"
                description="There was a problem loading the teams. Please try again."
                action={
                  <Button variant="outline" onClick={() => refetch()}>
                    Try Again
                  </Button>
                }
              />
            ) : filteredTeams.length === 0 ? (
              <EmptyState
                title="No teams found"
                description={searchQuery ? "No teams match your search. Try a different query." : "You don't have any teams yet. Create your first team to get started."}
                action={
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Team
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => router.push(`/teams/${team.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-teams" className="space-y-4">
            {isLoading ? (
              <LoadingState message="Loading your teams..." />
            ) : isError ? (
              <EmptyState
                title="Error loading your teams"
                description="There was a problem loading your teams. Please try again."
                action={
                  <Button variant="outline" onClick={() => refetch()}>
                    Try Again
                  </Button>
                }
              />
            ) : filteredTeams.length === 0 ? (
              <EmptyState
                title="No teams found"
                description={searchQuery ? "No teams match your search. Try a different query." : "You're not a member of any teams yet. Create or join a team to get started."}
                action={
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Team
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => router.push(`/teams/${team.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Team Dialog */}
      <CreateTeamDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetchAllTeams()
          refetchMyTeams()
          setIsCreateDialogOpen(false)
        }}
      />
    </DashboardShell>
  )
}
