'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useQueryClient, QueryObserverResult } from '@tanstack/react-query';
import { getTasks } from '@/lib/api/endpoints/tasks';
import { TasksQueryParams, TaskType } from '@/lib/api/types/tasks';
import { parseApiError } from '@/lib/error-handling';
import { taskKeys } from '@/lib/api/hooks/useTasks';
import { isAuthenticated } from '@/lib/auth';
import { setMockAuth, isDevelopment } from '@/lib/mock-auth';

// Define the actual API response structure
interface ApiTasksResponse {
  items: any[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;

  // Also support the PaginatedResponse structure from the API
  data?: any[];
  page?: number;
  limit?: number;
  total?: number;
}

// Define loading states for each task type
interface TasksLoadingState {
  all: boolean;
  my: boolean;
  team: boolean;
  created: boolean;
  unassigned: boolean;
}

// Extended query parameters for tasks
interface ExtendedTasksQueryParams extends TasksQueryParams {
  includeTags?: boolean;
  includeAssignee?: boolean;
  includeCreator?: boolean;
  includeProject?: boolean;
  status?: string;
  priority?: string;
  dueDate?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  projectId?: number;
}

interface TasksContextType {
  // Task data getters - these will fetch data on demand if not already loaded
  getTasksByType: (type: TaskType, params?: Partial<ExtendedTasksQueryParams>) => Promise<ApiTasksResponse | undefined>;

  // Get filtered tasks with advanced filtering options
  getFilteredTasks: (params: Partial<ExtendedTasksQueryParams>) => Promise<ApiTasksResponse | undefined>;

  // Direct access to already fetched data (won't trigger new fetches)
  allTasks: ApiTasksResponse | undefined;
  myTasks: ApiTasksResponse | undefined;
  teamTasks: ApiTasksResponse | undefined;
  createdTasks: ApiTasksResponse | undefined;
  unassignedTasks: ApiTasksResponse | undefined;

  // Loading and error states
  isLoading: boolean;
  isLoadingType: (type: TaskType) => boolean;
  isError: boolean;
  error: Error | null;

  // Refetch functions
  refetch: () => Promise<any>;
  refetchType: (type: TaskType, params?: Partial<ExtendedTasksQueryParams>) => Promise<any>;

  // Prefetch a specific task type (useful for preloading data)
  prefetchTaskType: (type: TaskType, params?: Partial<ExtendedTasksQueryParams>) => Promise<void>;

  // Pagination helpers
  goToPage: (type: TaskType, page: number) => Promise<ApiTasksResponse | undefined>;
  currentPage: Record<TaskType, number>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Helper function to create an empty response
const createEmptyResponse = (): ApiTasksResponse => ({
  items: [],
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,

  // Also include the PaginatedResponse format
  data: [],
  page: 1,
  limit: 10,
  total: 0
});

/**
 * Provider component that fetches and shares tasks data across components
 * Uses a lazy-loading approach to only fetch task types when needed
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Track which task types have been requested - start with 'all' to reduce multiple API calls
  const [requestedTypes, setRequestedTypes] = useState<Set<TaskType>>(new Set(['all']));

  // Set up mock authentication for development if not authenticated
  useEffect(() => {
    if (isDevelopment() && !isAuthenticated()) {
      console.log('Setting up mock authentication for development');
      setMockAuth();
    }
  }, []);

  // Track loading states for each task type
  const [loadingStates, setLoadingStates] = useState<TasksLoadingState>({
    all: false,
    my: false, // Don't start with loading state
    team: false,
    created: false,
    unassigned: false
  });

  // Use a ref to track if this is the initial mount
  const isInitialMount = React.useRef(true);

  // Track current page for each task type
  const [currentPage, setCurrentPage] = useState<Record<TaskType, number>>({
    all: 1,
    my: 1,
    team: 1,
    created: 1,
    unassigned: 1
  });

  // Track query parameters for each task type
  const [queryParams, setQueryParams] = useState<Record<TaskType, ExtendedTasksQueryParams>>({
    all: { pageNumber: 1, pageSize: 10 },
    my: { pageNumber: 1, pageSize: 10 },
    team: { pageNumber: 1, pageSize: 10 },
    created: { pageNumber: 1, pageSize: 10 },
    unassigned: { pageNumber: 1, pageSize: 10 }
  });

  // Create query functions for each task type
  const createTaskQuery = (type: TaskType) => {
    return useQuery({
      queryKey: taskKeys.list({ type, ...queryParams[type] }),
      queryFn: async () => {
        try {
          // Update loading state
          setLoadingStates(prev => ({ ...prev, [type]: true }));

          // Combine type with other query parameters
          const params = {
            type,
            ...queryParams[type]
          };

          console.log(`🔍 Fetching ${type} tasks with params:`, params);
          const result = await getTasks(params);
          console.log(`✅ ${type} tasks result:`, result);

          // Update loading state
          setLoadingStates(prev => ({ ...prev, [type]: false }));

          // Ensure we have a valid result
          if (!result) {
            console.error(`❌ No result returned for ${type} tasks`);
            return createEmptyResponse();
          }

          return result;
        } catch (error: any) {
          // Update loading state
          setLoadingStates(prev => ({ ...prev, [type]: false }));

          // If it's a 404 error, return empty data instead of throwing
          if (error.response?.status === 404) {
            return createEmptyResponse();
          }
          throw error;
        }
      },
      enabled: requestedTypes.has(type), // Only run the query if this type has been requested
      staleTime: 30000, // Consider data fresh for 30 seconds
      onError: (error) => {
        console.error(`Error fetching ${type} tasks:`, parseApiError(error));
      },
    });
  };

  // Create queries for each task type
  const allTasksQuery = createTaskQuery('all');
  const myTasksQuery = createTaskQuery('my');
  const teamTasksQuery = createTaskQuery('team');
  const createdTasksQuery = createTaskQuery('created');
  const unassignedTasksQuery = createTaskQuery('unassigned');

  // Handle component mount and unmount
  React.useEffect(() => {
    console.log("TasksProvider mounted");

    // Always reset loading states on mount
    setLoadingStates({
      all: false,
      my: false,
      team: false,
      created: false,
      unassigned: false
    });

    // Don't reset requested types to avoid duplicate fetches
    // setRequestedTypes(new Set(['my', 'team']));

    // Reset the initial mount flag
    isInitialMount.current = false;

    // Force immediate reset of any pending queries
    queryClient.cancelQueries({ queryKey: taskKeys.all });
    queryClient.resetQueries({ queryKey: taskKeys.all });

    // Cleanup function to reset state when component unmounts
    return () => {
      console.log("TasksProvider unmounted");

      // Reset the initial mount flag so next time it mounts it will reset states
      isInitialMount.current = true;

      // Reset loading states
      setLoadingStates({
        all: false,
        my: false,
        team: false,
        created: false,
        unassigned: false
      });

      // Cancel any pending queries
      queryClient.cancelQueries({ queryKey: taskKeys.all });

      // Invalidate all task queries to force a refetch when the component is remounted
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.resetQueries({ queryKey: taskKeys.all });

      // Clear the query cache for tasks
      queryClient.removeQueries({ queryKey: taskKeys.all });
    };
  }, [queryClient]);

  // Function to get tasks by type with optional additional parameters
  const getTasksByType = async (
    type: TaskType,
    params?: Partial<ExtendedTasksQueryParams>
  ): Promise<ApiTasksResponse | undefined> => {
    // If additional params are provided, update the query params for this type
    if (params) {
      setQueryParams(prev => ({
        ...prev,
        [type]: { ...prev[type], ...params }
      }));
    }

    // If this type hasn't been requested yet, mark it as requested and trigger the query
    if (!requestedTypes.has(type)) {
      setRequestedTypes(prev => new Set([...prev, type]));

      // Wait for the query to complete
      switch (type) {
        case 'all':
          await allTasksQuery.refetch();
          return allTasksQuery.data;
        case 'my':
          await myTasksQuery.refetch();
          return myTasksQuery.data;
        case 'team':
          await teamTasksQuery.refetch();
          return teamTasksQuery.data;
        case 'created':
          await createdTasksQuery.refetch();
          return createdTasksQuery.data;
        case 'unassigned':
          await unassignedTasksQuery.refetch();
          return unassignedTasksQuery.data;
      }
    } else if (params) {
      // If this type has been requested but params changed, refetch
      return await refetchType(type, params);
    }

    // Return the already loaded data
    switch (type) {
      case 'all': return allTasksQuery.data;
      case 'my': return myTasksQuery.data;
      case 'team': return teamTasksQuery.data;
      case 'created': return createdTasksQuery.data;
      case 'unassigned': return unassignedTasksQuery.data;
    }
  };

  // Function to get filtered tasks with advanced filtering
  const getFilteredTasks = async (
    params: Partial<ExtendedTasksQueryParams>
  ): Promise<ApiTasksResponse | undefined> => {
    console.log("getFilteredTasks called with params:", params);

    // Create a flag to track if this operation is still active
    let isActive = true;

    // Generate a cache key based on the params
    const cacheKey = JSON.stringify(params);

    // Check if we have this data in the cache
    const cachedData = queryClient.getQueryData(
      taskKeys.list({ ...params })
    ) as ApiTasksResponse | undefined;

    // If we have cached data and it's not stale, return it
    if (cachedData) {
      console.log("Using cached data for params:", params);
      return cachedData;
    }

    // Set loading state for 'all' type
    setLoadingStates(prev => ({ ...prev, all: true }));

    try {
      // Make a direct API call with the provided parameters
      console.log("🔍 Making API call to getTasks with params:", params);
      const result = await getTasks(params);
      console.log("✅ API call to getTasks completed");
      console.log("✅ Result:", result);
      console.log("✅ Result has items:", !!result?.items);
      console.log("✅ Result has data:", !!result?.data);
      console.log("✅ Items length:", result?.items?.length || 0);
      console.log("✅ Data length:", result?.data?.length || 0);

      // Cache the result
      queryClient.setQueryData(taskKeys.list({ ...params }), result);

      // Only update state if operation is still active
      if (isActive) {
        console.log("Setting loading state to false");
        setLoadingStates(prev => ({ ...prev, all: false }));
        return result;
      }
      console.log("Operation no longer active, not updating state");
      return undefined;
    } catch (error: any) {
      console.error("Error in getFilteredTasks:", error);

      // Only update state if operation is still active
      if (isActive) {
        console.log("Setting loading state to false after error");
        setLoadingStates(prev => ({ ...prev, all: false }));
        if (error.response?.status === 404) {
          return createEmptyResponse();
        }
      }
      throw error;
    } finally {
      // Ensure loading state is reset even if there's an error
      setTimeout(() => {
        if (isActive) {
          console.log("Final reset of loading state");
          setLoadingStates(prev => ({ ...prev, all: false }));
        }
      }, 100);

      // Return a cleanup function
      return () => {
        console.log("getFilteredTasks cleanup");
        isActive = false;
        setLoadingStates(prev => ({ ...prev, all: false }));
      };
    }
  };

  // Function to go to a specific page for a task type
  const goToPage = async (
    type: TaskType,
    page: number
  ): Promise<ApiTasksResponse | undefined> => {
    // Update current page for this type
    setCurrentPage(prev => ({ ...prev, [type]: page }));

    // Update query params with the new page number
    setQueryParams(prev => ({
      ...prev,
      [type]: { ...prev[type], pageNumber: page }
    }));

    // Refetch with the new page number
    return await refetchType(type, { pageNumber: page });
  };

  // Function to prefetch a task type without waiting for the result
  const prefetchTaskType = async (
    type: TaskType,
    params?: Partial<ExtendedTasksQueryParams>
  ): Promise<void> => {
    // If additional params are provided, update the query params for this type
    const queryParamsToUse = params
      ? { ...queryParams[type], ...params }
      : queryParams[type];

    await queryClient.prefetchQuery({
      queryKey: taskKeys.list({ type, ...queryParamsToUse }),
      queryFn: () => getTasks({ type, ...queryParamsToUse })
    });

    // Mark this type as requested
    setRequestedTypes(prev => new Set([...prev, type]));

    // Update query params if provided
    if (params) {
      setQueryParams(prev => ({
        ...prev,
        [type]: { ...prev[type], ...params }
      }));
    }
  };

  // Function to refetch tasks of a specific type with optional parameters
  const refetchType = async (
    type: TaskType,
    params?: Partial<ExtendedTasksQueryParams>
  ) => {
    // Make sure this type is marked as requested
    if (!requestedTypes.has(type)) {
      setRequestedTypes(prev => new Set([...prev, type]));
    }

    // If additional params are provided, update the query params for this type
    if (params) {
      setQueryParams(prev => ({
        ...prev,
        [type]: { ...prev[type], ...params }
      }));
    }

    // Update loading state
    setLoadingStates(prev => ({ ...prev, [type]: true }));

    let result;
    switch (type) {
      case 'my':
        result = await myTasksQuery.refetch();
        break;
      case 'team':
        result = await teamTasksQuery.refetch();
        break;
      case 'created':
        result = await createdTasksQuery.refetch();
        break;
      case 'unassigned':
        result = await unassignedTasksQuery.refetch();
        break;
      case 'all':
      default:
        result = await allTasksQuery.refetch();
        break;
    }

    // Update loading state
    setLoadingStates(prev => ({ ...prev, [type]: false }));

    return result;
  };

  // Refetch all requested task types
  const refetchAll = async () => {
    const promises: Promise<QueryObserverResult<any, unknown>>[] = [];

    // Only refetch types that have been requested
    if (requestedTypes.has('all')) promises.push(allTasksQuery.refetch());
    if (requestedTypes.has('my')) promises.push(myTasksQuery.refetch());
    if (requestedTypes.has('team')) promises.push(teamTasksQuery.refetch());
    if (requestedTypes.has('created')) promises.push(createdTasksQuery.refetch());
    if (requestedTypes.has('unassigned')) promises.push(unassignedTasksQuery.refetch());

    return await Promise.all(promises);
  };

  // Function to check if a specific type is loading
  const isLoadingType = (type: TaskType): boolean => {
    return loadingStates[type];
  };

  // Determine overall loading and error states
  const isLoading = Object.values(loadingStates).some(state => state);

  const isError =
    (requestedTypes.has('all') && allTasksQuery.isError) ||
    (requestedTypes.has('my') && myTasksQuery.isError) ||
    (requestedTypes.has('team') && teamTasksQuery.isError) ||
    (requestedTypes.has('created') && createdTasksQuery.isError) ||
    (requestedTypes.has('unassigned') && unassignedTasksQuery.isError);

  const error =
    (requestedTypes.has('all') && allTasksQuery.error) ||
    (requestedTypes.has('my') && myTasksQuery.error) ||
    (requestedTypes.has('team') && teamTasksQuery.error) ||
    (requestedTypes.has('created') && createdTasksQuery.error) ||
    (requestedTypes.has('unassigned') && unassignedTasksQuery.error);

  return (
    <TasksContext.Provider
      value={{
        // Task data getters
        getTasksByType,
        getFilteredTasks,

        // Direct access to already fetched data
        allTasks: allTasksQuery.data,
        myTasks: myTasksQuery.data,
        teamTasks: teamTasksQuery.data,
        createdTasks: createdTasksQuery.data,
        unassignedTasks: unassignedTasksQuery.data,

        // Loading and error states
        isLoading,
        isLoadingType,
        isError,
        error: error as Error | null,

        // Refetch functions
        refetch: refetchAll,
        refetchType,

        // Prefetch function
        prefetchTaskType,

        // Pagination helpers
        goToPage,
        currentPage
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

/**
 * Hook to access the tasks context
 */
export function useDashboardTasks() {
  const context = useContext(TasksContext);

  if (context === undefined) {
    throw new Error('useDashboardTasks must be used within a TasksProvider');
  }

  return context;
}
