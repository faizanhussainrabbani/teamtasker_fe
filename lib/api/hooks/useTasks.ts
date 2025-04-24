import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskProgress
} from '../endpoints/tasks';
import {
  TaskCreateRequest,
  TaskUpdateRequest,
  TasksQueryParams
} from '../types/tasks';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TasksQueryParams) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Hook for fetching tasks with filters
 */
export const useTasks = (params?: TasksQueryParams) => {
  return useQuery({
    queryKey: taskKeys.list(params || {}),
    queryFn: async () => {
      try {
        return await getTasks(params);
      } catch (error: any) {
        // If it's a 404 error, return empty data instead of throwing
        if (error.response?.status === 404) {
          return { data: [], total: 0, page: 1, limit: params?.limit || 10 };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching tasks:', parseApiError(error));
    },
  });
};

/**
 * Hook for fetching a single task
 */
export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id, // Only run if id is provided
    onError: (error) => {
      console.error(`Error fetching task ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for creating a task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTask: TaskCreateRequest) => createTask(newTask),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating task:', parseApiError(error));
    },
  });
};

/**
 * Hook for updating a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskUpdateRequest }) =>
      updateTask(id, task),
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      // Invalidate the tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`Error updating task ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for deleting a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: (_, id) => {
      // Remove the task from the cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      // Invalidate the tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error, id) => {
      console.error(`Error deleting task ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for updating task status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      // Invalidate the tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`Error updating task status ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for updating task progress
 */
export const useUpdateTaskProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      updateTaskProgress(id, progress),
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      // Invalidate the tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`Error updating task progress ${id}:`, parseApiError(error));
    },
  });
};
