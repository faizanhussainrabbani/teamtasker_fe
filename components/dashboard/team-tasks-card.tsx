"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTeamTasks } from "@/lib/api/hooks/useTeamTasks"
import { useDashboardTasks } from "@/context/tasks-context"
import { LoadingState, EmptyState } from "@/components/ui/api-state"

interface TeamTasksCardProps {
  isLoading?: boolean;
}

/**
 * TeamTasksCard component displays tasks assigned to team members
 * Allows filtering by task status and shows detailed task information
 */
export function TeamTasksCard({ isLoading: cardIsLoading }: TeamTasksCardProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get team tasks data from context
  const {
    teamTasks,
    isLoading: contextLoading,
    isLoadingType,
    isError: contextError,
    error: contextErrorDetails,
    refetchType,
    getTasksByType
  } = useDashboardTasks();

  // Fetch team tasks data using the hook (which now uses teamTasks from context)
  const {
    data: teamData,
    isLoading: dataIsLoading,
    isError,
    error,
    refetch
  } = useTeamTasks();

  // Ensure team tasks are loaded
  useEffect(() => {
    if (!teamTasks) {
      getTasksByType('team');
    }
  }, [teamTasks, getTasksByType]);

  // Combine loading states
  const isLoading = cardIsLoading || dataIsLoading;

  // Filter team members based on active tab
  const filteredTeamData = activeTab === "all"
    ? teamData
    : teamData?.filter(member =>
        member.tasks.some(task => task.status.toLowerCase() === activeTab)
      );

  // Handle manual refresh with loading indicator
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh both the context data and the hook data
    await Promise.all([
      refetchType('team'),
      refetch()
    ]);
    setTimeout(() => setIsRefreshing(false), 500); // Ensure loading state is visible briefly
  };

  // Reset refreshing state if it gets stuck
  useEffect(() => {
    if (isRefreshing) {
      const timer = setTimeout(() => setIsRefreshing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing]);

  // Get task counts for each status
  const getTaskCounts = () => {
    if (!teamData) return { total: 0, todo: 0, inProgress: 0, completed: 0 };

    let counts = { total: 0, todo: 0, inProgress: 0, completed: 0 };

    teamData.forEach(member => {
      member.tasks.forEach(task => {
        counts.total++;

        const status = task.status.toLowerCase();
        if (status === 'todo') counts.todo++;
        else if (status === 'in-progress') counts.inProgress++;
        else if (status === 'completed') counts.completed++;
      });
    });

    return counts;
  };

  const taskCounts = getTaskCounts();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Tasks</CardTitle>
          <CardDescription>See what your team is working on</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            title="Refresh team tasks"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            Team Details <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All
              {taskCounts.total > 0 && <span className="ml-1 text-xs">({taskCounts.total})</span>}
            </TabsTrigger>
            <TabsTrigger value="todo">
              To Do
              {taskCounts.todo > 0 && <span className="ml-1 text-xs">({taskCounts.todo})</span>}
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress
              {taskCounts.inProgress > 0 && <span className="ml-1 text-xs">({taskCounts.inProgress})</span>}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {taskCounts.completed > 0 && <span className="ml-1 text-xs">({taskCounts.completed})</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading || isRefreshing ? (
              <LoadingState message="Loading team tasks..." />
            ) : isError ? (
              <EmptyState
                title="Error loading team tasks"
                description={error?.message || "There was a problem loading team tasks."}
                action={
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    Try Again
                  </Button>
                }
              />
            ) : !filteredTeamData || filteredTeamData.length === 0 ? (
              <EmptyState
                title="No team tasks found"
                description={
                  teamData?.length === 0
                    ? "There are no team members with assigned tasks."
                    : `There are no ${activeTab !== 'all' ? activeTab + ' ' : ''}tasks assigned to your team.`
                }
                action={
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    Refresh
                  </Button>
                }
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
                      <div className="ml-auto text-xs text-muted-foreground">
                        {member.tasks.length} {member.tasks.length === 1 ? 'task' : 'tasks'}
                      </div>
                    </div>

                    {/* Only show tasks that match the active tab filter */}
                    <div className="ml-10 space-y-2">
                      {member.tasks
                        .filter(task => activeTab === "all" || task.status.toLowerCase() === activeTab)
                        .map(task => (
                          <div key={task.id} className="rounded-md border p-2 text-sm hover:bg-muted/50 transition-colors">
                            <div className="font-medium">{task.title}</div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <span>•</span>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <span>•</span>
                              <span>Due {formatDate(task.dueDate)}</span>
                              {task.project && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[100px]">{task.project.name}</span>
                                </>
                              )}
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

// Helper function to format date in a user-friendly way
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'No date';
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format date based on how soon it is
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // For dates within the next 7 days, show day name
      const diffTime = Math.abs(date.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        return date.toLocaleDateString(undefined, { weekday: 'long' });
      } else {
        // For other dates, show month and day
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
