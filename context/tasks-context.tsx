'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasks } from '@/lib/api/endpoints/tasks';
import { TasksQueryParams } from '@/lib/api/types/tasks';
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
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

/**
 * Provider component that fetches and shares tasks data across components
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  // Fetch all tasks without filters to be shared across components
  const {
    data: allTasks,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: taskKeys.list({}),
    queryFn: async () => {
      try {
        return await getTasks();
      } catch (error: any) {
        // If it's a 404 error, return empty data instead of throwing
        if (error.response?.status === 404) {
          return { data: [], total: 0, page: 1, limit: 10 };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching tasks:', parseApiError(error));
    },
  });

  return (
    <TasksContext.Provider
      value={{
        allTasks,
        isLoading,
        isError,
        error: error as Error | null,
        refetch
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
