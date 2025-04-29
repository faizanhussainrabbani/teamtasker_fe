"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SortAsc,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"
import { useDeleteTask, useUpdateTaskStatus } from "@/lib/api/hooks/useTasks"
import { TaskStatus, TaskPriority } from "@/lib/api/types/tasks"
import { useDashboardTasks } from "@/context/tasks-context"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

// This would be replaced by API data

// Update the getStatusIcon function to use blue colors
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-400" />
    case "todo":
      return <Circle className="h-5 w-5 text-gray-400" />
    default:
      return <AlertCircle className="h-5 w-5 text-blue-300" />
  }
}

// Function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
    case "medium":
      return "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
    case "low":
      return "text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
    default:
      return ""
  }
}

export function TasksList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Use the enhanced TasksContext
  const {
    getFilteredTasks,
    isLoading: contextLoading,
    isError: contextError,
    error: contextErrorData
  } = useDashboardTasks();

  // State for the filtered tasks data
  const [tasksData, setTasksData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(true);

  // Store the getFilteredTasks function in a ref to prevent it from causing infinite loops
  const getFilteredTasksRef = React.useRef(getFilteredTasks);

  // Update the ref when getFilteredTasks changes
  React.useEffect(() => {
    getFilteredTasksRef.current = getFilteredTasks;
  }, [getFilteredTasks]);

  // Set up cleanup on unmount and handle click outside for menus
  React.useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      const menus = document.querySelectorAll('[id^="task-menu-"]');
      menus.forEach((menu) => {
        if (menu.style.display === 'block' && !menu.contains(event.target) &&
            !event.target.closest('button')?.getAttribute('aria-label')?.includes('More options')) {
          menu.style.display = 'none';
        }
      });
    };

    // Add event listener
    document.addEventListener('click', handleClickOutside);

    return () => {
      isMounted.current = false;
      // Remove event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to fetch tasks
  const fetchTasks = React.useCallback(async () => {
    if (!isMounted.current) return;

    // Set loading state
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Build API parameters
      const params = {
        status: statusFilter !== "all" ? statusFilter as TaskStatus : undefined,
        priority: priorityFilter !== "all" ? priorityFilter as TaskPriority : undefined,
        search: debouncedSearch || undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
        includeTags: true,
        includeAssignee: true,
        includeCreator: true,
      };

      // Use the ref to get the latest function without causing dependency issues
      const result = await getFilteredTasksRef.current(params);

      // Only update state if component is still mounted
      if (isMounted.current) {
        setTasksData(result);
        setIsLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("Error fetching tasks:", err);
        setIsError(true);
        setError(err);
        setIsLoading(false);
      }
    }

    // Return a promise that resolves when the fetch is complete
    return new Promise<void>((resolve) => {
      // Use setTimeout to ensure the loading state is properly updated
      setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
        resolve();
      }, 0);
    });
  }, [statusFilter, priorityFilter, debouncedSearch, currentPage, pageSize]); // Removed getFilteredTasks and tasksData from dependencies

  // Fetch tasks when filters change or component mounts
  React.useEffect(() => {
    // Create a flag to track if this effect is still active
    let isActive = true;

    // Reset loading state when component mounts
    setIsLoading(true);

    // Use an async function to handle the fetch
    const loadData = async () => {
      try {
        await fetchTasks();
      } finally {
        // Only update state if the effect is still active and component is mounted
        if (isActive && isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    // Call the async function
    loadData();

    // Cleanup function to reset state when component unmounts or dependencies change
    return () => {
      // Mark this effect as inactive
      isActive = false;

      // Reset loading state if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    };
  }, [fetchTasks]);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setDebouncedSearch(searchQuery);
        // Reset to first page when search changes
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === currentPage) return; // Avoid unnecessary updates

    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete task mutation
  const deleteTaskMutation = useDeleteTask();

  // Update task status mutation
  const updateTaskStatusMutation = useUpdateTaskStatus();

  // Refetch tasks after mutations - use the fetchTasks function
  const refetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchTasks();
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchTasks]);

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(id);
        // Refetch tasks after successful deletion
        refetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateTaskStatusMutation.mutateAsync({ id, status });
      // Refetch tasks after successful status update
      refetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openTaskDialog = (task: any) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and track your team's tasks</CardDescription>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 w-[130px]">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => {
                    if (isMounted.current) {
                      setStatusFilter(e.target.value);
                    }
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 w-[130px]">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <select
                  className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={priorityFilter}
                  onChange={(e) => {
                    if (isMounted.current) {
                      setPriorityFilter(e.target.value);
                    }
                  }}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState message="Loading tasks..." />
          ) : isError ? (
            <ErrorState
              message={`Error loading tasks: ${error?.message || 'Unknown error'}`}
              onRetry={() => refetchTasks()}
            />
          ) : !tasksData || tasksData.items.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description="There are no tasks matching your filters."
              action={
                <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {tasksData.items.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm cursor-pointer hover:bg-muted/50"
                  onClick={() => openTaskDialog(task)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(
                          task.id,
                          task.status === "completed" ? "todo" : "completed",
                          e
                        );
                      }}
                    />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="hidden text-xs text-muted-foreground md:block">{task.description}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 md:flex">
                      {task.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="hidden w-32 md:block">
                      <div className="flex items-center justify-between text-xs">
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1.5" />
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
                      <AvatarFallback>{task.assignee?.initials}</AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="More options"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Use a simple approach instead of DropdownMenu
                          const menu = document.getElementById(`task-menu-${task.id}`);
                          if (menu) {
                            // Close all other menus first
                            document.querySelectorAll('[id^="task-menu-"]').forEach((m) => {
                              if (m.id !== `task-menu-${task.id}`) {
                                m.style.display = 'none';
                              }
                            });
                            // Toggle this menu
                            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                          }
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>

                      {/* Simple menu implementation */}
                      <div
                        id={`task-menu-${task.id}`}
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        style={{ display: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDialog(task);
                              document.getElementById(`task-menu-${task.id}`).style.display = 'none';
                            }}
                          >
                            Edit Task
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, task.status === "todo" ? "in-progress" : "todo", e);
                              document.getElementById(`task-menu-${task.id}`).style.display = 'none';
                            }}
                          >
                            {task.status === "todo" ? "Mark as In Progress" : "Mark as To Do"}
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, task.status === "completed" ? "in-progress" : "completed", e);
                              document.getElementById(`task-menu-${task.id}`).style.display = 'none';
                            }}
                          >
                            {task.status === "completed" ? "Mark as In Progress" : "Mark as Completed"}
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id, e);
                              document.getElementById(`task-menu-${task.id}`).style.display = 'none';
                            }}
                          >
                            <Trash2 className="inline-block mr-2 h-4 w-4" />
                            Delete Task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Pagination */}
              {tasksData && tasksData.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      {/* Previous page button */}
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, tasksData.totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (tasksData.totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          // If near start, show first 5 pages
                          pageNum = i + 1;
                        } else if (currentPage >= tasksData.totalPages - 2) {
                          // If near end, show last 5 pages
                          pageNum = tasksData.totalPages - 4 + i;
                        } else {
                          // Otherwise show 2 before and 2 after current page
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {/* Next page button */}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < tasksData.totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === tasksData.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Page size selector */}
              <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
                <span className="mr-2">Rows per page:</span>
                <select
                  className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={pageSize}
                  onChange={(e) => {
                    if (isMounted.current) {
                      const newSize = parseInt(e.target.value);
                      setPageSize(newSize);
                      setCurrentPage(1); // Reset to first page when changing page size
                    }
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {isDialogOpen && (
        <TaskDialog
          task={selectedTask}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Refetch tasks when dialog is closed to reflect any changes
              refetchTasks();
            }
          }}
        />
      )}
    </Card>
  )
}
