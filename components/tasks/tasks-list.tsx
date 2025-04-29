"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { isAuthenticated } from "@/lib/auth"
import { setMockAuth, isDevelopment } from "@/lib/mock-auth"
import { createTestTask } from "@/lib/create-test-task"

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

  // No global loading state

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

  // Handle component mount and unmount
  React.useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;

    // Set up mock authentication for development if not authenticated
    if (isDevelopment() && !isAuthenticated()) {
      setMockAuth();
    }

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
      // Mark component as unmounted
      isMounted.current = false;

      // Remove event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to fetch tasks with caching
  const fetchTasks = React.useCallback(async () => {
    if (!isMounted.current) {
      return;
    }

    // Create a flag to track if this operation is still active
    let isActive = true;

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

    // Create a cache key for this request
    const cacheKey = JSON.stringify(params);

    // Check if we have a cached result for this exact query
    const cachedResult = localStorage.getItem(`tasks_cache_${cacheKey}`);
    const cacheTimestamp = localStorage.getItem(`tasks_cache_timestamp_${cacheKey}`);

    // If we have a cached result that's less than 30 seconds old, use it
    if (cachedResult && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp);
      if (age < 30000) { // 30 seconds

        if (isMounted.current && isActive) {
          setTasksData(JSON.parse(cachedResult));
          return;
        }
      }
    }

    // Set local loading state
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Use the ref to get the latest function without causing dependency issues
      const result = await getFilteredTasksRef.current(params);

      // Process the result to ensure it's in a usable format
      let processedResult;

      // Check if result is a function (cleanup function) or invalid
      if (!result || typeof result === 'function') {
        processedResult = {
          items: [],
          data: [],
          pageNumber: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0
        };
      }
      // If result is an array, wrap it
      else if (Array.isArray(result)) {
        processedResult = {
          items: result,
          data: result,
          pageNumber: 1,
          pageSize: result.length,
          totalCount: result.length,
          totalPages: 1
        };
      }
      // If result is a single task object (not an array and has id and title)
      else if (result && !Array.isArray(result) && result.id && result.title && !result.items && !result.data) {
        processedResult = {
          items: [result],
          data: [result],
          pageNumber: 1,
          pageSize: 1,
          totalCount: 1,
          totalPages: 1
        };
      }
      // If it's a valid object with the expected structure
      else {
        processedResult = result;
      }

      // Cache the processed result
      localStorage.setItem(`tasks_cache_${cacheKey}`, JSON.stringify(processedResult));
      localStorage.setItem(`tasks_cache_timestamp_${cacheKey}`, Date.now().toString());

      // Only update state if component is still mounted and operation is active
      if (isMounted.current && isActive) {
        setTasksData(processedResult);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);

      if (isMounted.current && isActive) {
        setIsError(true);
        setError(err);
        setIsLoading(false);
      }
    }

    // Ensure loading state is reset
    setTimeout(() => {
      if (isMounted.current && isActive) {
        setIsLoading(false);
      }
    }, 100);

    // Return a cleanup function
    return () => {
      isActive = false;
    };
  }, [statusFilter, priorityFilter, debouncedSearch, currentPage, pageSize]); // Removed getFilteredTasks and tasksData from dependencies

  // Function to create a test task if none are found
  const createTestTaskIfNeeded = React.useCallback(async (currentTasksData) => {
    if (!isDevelopment()) return;



    try {
      // Only create a test task if we have no tasks
      // Use the passed data parameter instead of the state variable
      if (currentTasksData &&
          ((!currentTasksData.items || currentTasksData.items.length === 0) &&
           (!currentTasksData.data || currentTasksData.data.length === 0))) {

        await createTestTask();
        // Return true to indicate a test task was created
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating test task:", error);
      return false;
    }
  }, []);

  // Fetch tasks when filters change or component mounts
  React.useEffect(() => {


    // Skip if component is not mounted
    if (!isMounted.current) {

      return;
    }

    // Create a flag to track if this effect is still active
    let isActive = true;

    // Reset loading state when component mounts
    setIsLoading(true);

    // Use an async function to handle the fetch
    const loadData = async () => {
      try {
        await fetchTasks();

        // Check if we need to create a test task after loading
        if (isDevelopment() && isActive && isMounted.current) {
          const testTaskCreated = await createTestTaskIfNeeded(tasksData);
          // Only refetch if a test task was created
          if (testTaskCreated && isActive && isMounted.current) {
            await fetchTasks();
          }
        }
      } catch (error) {
        console.error("TasksList loadData error:", error);
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

      // Reset loading states if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    };
  }, [fetchTasks]); // Removed createTestTaskIfNeeded from dependencies

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
    // Create a flag to track if this operation is still active
    let isActive = true;

    // Set local loading state
    setIsLoading(true);

    try {
      await fetchTasks();
    } catch (error) {
      console.error("refetchTasks error:", error);
    } finally {
      // Only update state if operation is still active and component is mounted
      if (isActive && isMounted.current) {

        setIsLoading(false);
      }
    }

    // Return a cleanup function
    return () => {
      isActive = false;
    };
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
          ) : (function() {
            // Comprehensive check for empty data
            if (!tasksData) {
              return true;
            }

            // Check if it's an array
            if (Array.isArray(tasksData)) {
              return tasksData.length === 0;
            }

            // Check items property
            if (tasksData.items) {
              if (Array.isArray(tasksData.items) && tasksData.items.length > 0) {
                return false;
              }
            }

            // Check data property
            if (tasksData.data) {
              if (Array.isArray(tasksData.data) && tasksData.data.length > 0) {
                return false;
              }
            }

            // Check if it's a single task object
            if (tasksData.id && tasksData.title) {
              return false;
            }

            return true;
          })() ? (
            <EmptyState
              title="No tasks found"
              description="There are no tasks matching your filters."
              action={
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>


                </div>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {(function() {
                  // Get the tasks array from wherever it exists
                  let tasksToRender = [];

                  if (tasksData.items && Array.isArray(tasksData.items) && tasksData.items.length > 0) {
                    tasksToRender = tasksData.items;
                  } else if (tasksData.data && Array.isArray(tasksData.data) && tasksData.data.length > 0) {
                    tasksToRender = tasksData.data;
                  } else if (Array.isArray(tasksData)) {
                    tasksToRender = tasksData;
                  } else {
                    // Check if tasksData itself is a task object
                    if (tasksData && tasksData.id && tasksData.title) {
                      tasksToRender = [tasksData];
                    } else {
                      tasksToRender = [];
                    }
                  }

                  return tasksToRender;
                })().map((task) => (
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
              {tasksData && (tasksData.totalPages > 1 || (tasksData.total && tasksData.limit && Math.ceil(tasksData.total / tasksData.limit) > 1)) && (
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
                      {Array.from({ length: Math.min(5, tasksData.totalPages || Math.ceil((tasksData.total || 0) / (tasksData.limit || 10))) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        const totalPages = tasksData.totalPages || Math.ceil((tasksData.total || 0) / (tasksData.limit || 10));
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          // If near start, show first 5 pages
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If near end, show last 5 pages
                          pageNum = totalPages - 4 + i;
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
                            const totalPages = tasksData.totalPages || Math.ceil((tasksData.total || 0) / (tasksData.limit || 10));
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === (tasksData.totalPages || Math.ceil((tasksData.total || 0) / (tasksData.limit || 10))) ? "pointer-events-none opacity-50" : ""}
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
