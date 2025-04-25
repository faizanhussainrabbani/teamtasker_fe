'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useQuery, useQueryClient, QueryObserverResult } from '@tanstack/react-query';
import { getTasks } from '@/lib/api/endpoints/tasks';
import { TasksQueryParams, TaskType } from '@/lib/api/types/tasks';
import { parseApiError } from '@/lib/error-handling';
import { taskKeys } from '@/lib/api/hooks/useTasks';

// Define the actual API response structure
interface ApiTasksResponse {
  items: any[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Define loading states for each task type
interface TasksLoadingState {
  all: boolean;
  my: boolean;
  team: boolean;
  created: boolean;
  unassigned: boolean;
}

interface TasksContextType {
  // Task data getters - these will fetch data on demand if not already loaded
  getTasksByType: (type: TaskType) => Promise<ApiTasksResponse | undefined>;

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
  refetchType: (type: TaskType) => Promise<any>;

  // Prefetch a specific task type (useful for preloading data)
  prefetchTaskType: (type: TaskType) => Promise<void>;
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
  hasNextPage: false
});

/**
 * Provider component that fetches and shares tasks data across components
 * Uses a lazy-loading approach to only fetch task types when needed
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Track which task types have been requested
  const [requestedTypes, setRequestedTypes] = useState<Set<TaskType>>(new Set(['my', 'team']));

  // Track loading states for each task type
  const [loadingStates, setLoadingStates] = useState<TasksLoadingState>({
    all: false,
    my: true, // Start with my and team tasks loading
    team: true,
    created: false,
    unassigned: false
  });

  // Create query functions for each task type
  const createTaskQuery = (type: TaskType) => {
    return useQuery({
      queryKey: taskKeys.list({ type }),
      queryFn: async () => {
        try {
          // Update loading state
          setLoadingStates(prev => ({ ...prev, [type]: true }));

          const result = await getTasks({ type });

          // Update loading state
          setLoadingStates(prev => ({ ...prev, [type]: false }));

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

  // Function to get tasks by type, fetching them if not already loaded
  const getTasksByType = async (type: TaskType): Promise<ApiTasksResponse | undefined> => {
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

  // Function to prefetch a task type without waiting for the result
  const prefetchTaskType = async (type: TaskType): Promise<void> => {
    await queryClient.prefetchQuery({
      queryKey: taskKeys.list({ type }),
      queryFn: () => getTasks({ type })
    });

    // Mark this type as requested
    setRequestedTypes(prev => new Set([...prev, type]));
  };

  // Function to refetch tasks of a specific type
  const refetchType = async (type: TaskType) => {
    // Make sure this type is marked as requested
    if (!requestedTypes.has(type)) {
      setRequestedTypes(prev => new Set([...prev, type]));
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
        prefetchTaskType
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
