'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

interface TasksContextType {
  allTasks: ApiTasksResponse | undefined;
  myTasks: ApiTasksResponse | undefined;
  teamTasks: ApiTasksResponse | undefined;
  createdTasks: ApiTasksResponse | undefined;
  unassignedTasks: ApiTasksResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  refetchType: (type: TaskType) => Promise<any>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

/**
 * Provider component that fetches and shares tasks data across components
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  // Fetch all tasks without type filter
  const allTasksQuery = useQuery({
    queryKey: taskKeys.list({ type: 'all' }),
    queryFn: async () => {
      try {
        return await getTasks({ type: 'all' });
      } catch (error: any) {
        // If it's a 404 error, return empty data instead of throwing
        if (error.response?.status === 404) {
          return { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching all tasks:', parseApiError(error));
    },
  });

  // Fetch tasks assigned to current user
  const myTasksQuery = useQuery({
    queryKey: taskKeys.list({ type: 'my' }),
    queryFn: async () => {
      try {
        return await getTasks({ type: 'my' });
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching my tasks:', parseApiError(error));
    },
  });

  // Fetch tasks assigned to team members
  const teamTasksQuery = useQuery({
    queryKey: taskKeys.list({ type: 'team' }),
    queryFn: async () => {
      try {
        return await getTasks({ type: 'team' });
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching team tasks:', parseApiError(error));
    },
  });

  // Fetch tasks created by current user
  const createdTasksQuery = useQuery({
    queryKey: taskKeys.list({ type: 'created' }),
    queryFn: async () => {
      try {
        return await getTasks({ type: 'created' });
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching created tasks:', parseApiError(error));
    },
  });

  // Fetch unassigned tasks
  const unassignedTasksQuery = useQuery({
    queryKey: taskKeys.list({ type: 'unassigned' }),
    queryFn: async () => {
      try {
        return await getTasks({ type: 'unassigned' });
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching unassigned tasks:', parseApiError(error));
    },
  });

  // Function to refetch tasks of a specific type
  const refetchType = async (type: TaskType) => {
    switch (type) {
      case 'my':
        return await myTasksQuery.refetch();
      case 'team':
        return await teamTasksQuery.refetch();
      case 'created':
        return await createdTasksQuery.refetch();
      case 'unassigned':
        return await unassignedTasksQuery.refetch();
      case 'all':
      default:
        return await allTasksQuery.refetch();
    }
  };

  // Refetch all task types
  const refetchAll = async () => {
    await Promise.all([
      allTasksQuery.refetch(),
      myTasksQuery.refetch(),
      teamTasksQuery.refetch(),
      createdTasksQuery.refetch(),
      unassignedTasksQuery.refetch()
    ]);
  };

  // Determine overall loading and error states
  const isLoading =
    allTasksQuery.isLoading ||
    myTasksQuery.isLoading ||
    teamTasksQuery.isLoading ||
    createdTasksQuery.isLoading ||
    unassignedTasksQuery.isLoading;

  const isError =
    allTasksQuery.isError ||
    myTasksQuery.isError ||
    teamTasksQuery.isError ||
    createdTasksQuery.isError ||
    unassignedTasksQuery.isError;

  const error =
    allTasksQuery.error ||
    myTasksQuery.error ||
    teamTasksQuery.error ||
    createdTasksQuery.error ||
    unassignedTasksQuery.error;

  return (
    <TasksContext.Provider
      value={{
        allTasks: allTasksQuery.data,
        myTasks: myTasksQuery.data,
        teamTasks: teamTasksQuery.data,
        createdTasks: createdTasksQuery.data,
        unassignedTasks: unassignedTasksQuery.data,
        isLoading,
        isError,
        error: error as Error | null,
        refetch: refetchAll,
        refetchType
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
