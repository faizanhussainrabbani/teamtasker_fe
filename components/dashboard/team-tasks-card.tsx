"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTeamTasks } from "@/lib/api/hooks/useTeamTasks"
import { LoadingState, EmptyState } from "@/components/ui/api-state"

interface TeamTasksCardProps {
  isLoading?: boolean;
}

export function TeamTasksCard({ isLoading: cardIsLoading }: TeamTasksCardProps) {
  const [activeTab, setActiveTab] = useState("all")
  
  // Fetch team tasks data
  const { data: teamData, isLoading: dataIsLoading, isError, refetch } = useTeamTasks();
  
  // Combine loading states
  const isLoading = cardIsLoading || dataIsLoading;

  // Filter team members based on active tab
  const filteredTeamData = activeTab === "all" 
    ? teamData 
    : teamData?.filter(member => 
        member.tasks.some(task => task.status.toLowerCase() === activeTab)
      );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Tasks</CardTitle>
          <CardDescription>See what your team is working on</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Team Details <ChevronRight className="ml-1 h-4 w-4" />
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
              <LoadingState message="Loading team tasks..." />
            ) : isError ? (
              <EmptyState
                title="No team members found"
                description="There are no team members with assigned tasks."
                action={
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try Again
                  </Button>
                }
              />
            ) : !filteredTeamData || filteredTeamData.length === 0 ? (
              <EmptyState
                title="No team tasks found"
                description={`There are no ${activeTab !== 'all' ? activeTab + ' ' : ''}tasks assigned to your team.`}
              />
            ) : (
              <div className="space-y-6">
                {filteredTeamData.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    
                    {/* Only show tasks that match the active tab filter */}
                    <div className="ml-10 space-y-2">
                      {member.tasks
                        .filter(task => activeTab === "all" || task.status.toLowerCase() === activeTab)
                        .map(task => (
                          <div key={task.id} className="rounded-md border p-2 text-sm">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <span>•</span>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <span>•</span>
                              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      
                      {member.tasks.filter(task => 
                        activeTab === "all" || task.status.toLowerCase() === activeTab
                      ).length === 0 && (
                        <p className="text-xs text-muted-foreground italic">
                          No {activeTab !== 'all' ? activeTab + ' ' : ''}tasks assigned
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  const priorityLower = priority.toLowerCase();
  switch (priorityLower) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}
