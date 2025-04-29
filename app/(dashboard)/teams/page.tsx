"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTeams } from "@/lib/api/hooks/useTeams"
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Fetch teams data
  const { data: teamsData, isLoading, isError, refetch } = useTeams({
    search: searchQuery || undefined
  })
  
  // Filter teams based on search query
  const filteredTeams = teamsData?.items || []
  
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
        
        <Tabs defaultValue="all" className="space-y-4">
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
                icon={Users}
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
            {/* Similar content for My Teams tab */}
            <EmptyState
              icon={Users}
              title="My Teams feature coming soon"
              description="This feature is currently under development."
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Team Dialog */}
      <CreateTeamDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetch()
          setIsCreateDialogOpen(false)
        }}
      />
    </DashboardShell>
  )
}
