import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Task,
  TaskCreateRequest, 
  TaskUpdateRequest, 
  TasksQueryParams,
  TasksResponse,
} from '../types/tasks';
import { parseApiError } from '@/lib/error-handling';

const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
};

type OfflineTaskStatusUpdate = {
  id: string;
  status: string;
  queuedAt: number;
};

const OFFLINE_STATUS_QUEUE_KEY = 'teamtasker:offline-task-status-queue';

const isBrowser = typeof window !== 'undefined';

const readOfflineStatusQueue = (): OfflineTaskStatusUpdate[] => {
  if (!isBrowser) {
    return [];
  }

  const rawValue = window.localStorage.getItem(OFFLINE_STATUS_QUEUE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as OfflineTaskStatusUpdate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(OFFLINE_STATUS_QUEUE_KEY);
    return [];
  }
};

const writeOfflineStatusQueue = (queue: OfflineTaskStatusUpdate[]): void => {
  if (!isBrowser) {
    return;
  }

  if (queue.length === 0) {
    window.localStorage.removeItem(OFFLINE_STATUS_QUEUE_KEY);
    return;
  }

  window.localStorage.setItem(OFFLINE_STATUS_QUEUE_KEY, JSON.stringify(queue));
};

const enqueueOfflineStatusUpdate = (update: OfflineTaskStatusUpdate): void => {
  const queue = readOfflineStatusQueue();
  const nextQueue = queue.filter((item) => item.id !== update.id);
  nextQueue.push(update);
  writeOfflineStatusQueue(nextQueue);
};

const applyStatusToListData = (
  existing: TasksResponse | undefined,
  id: string,
  status: string,
): TasksResponse | undefined => {
  if (!existing) {
    return existing;
  }

  return {
    ...existing,
    data: existing.data.map((task) =>
      task.id === id
        ? {
            ...task,
            status: status as Task['status'],
          }
        : task,
    ),
  };
};

const findTaskInListCaches = (queryClient: QueryClient, id: string): Task | undefined => {
  const listCaches = queryClient.getQueriesData<TasksResponse>({ queryKey: taskKeys.lists() });

  for (const [, data] of listCaches) {
    const task = data?.data.find((item) => item.id === id);
    if (task) {
      return task;
    }
  }

  return undefined;
};

const applyTaskStatusOptimistically = (
  queryClient: QueryClient,
  id: string,
  status: string,
): void => {
  const listCaches = queryClient.getQueriesData<TasksResponse>({ queryKey: taskKeys.lists() });

  listCaches.forEach(([key, data]) => {
    queryClient.setQueryData(key, applyStatusToListData(data, id, status));
  });

  const detailCache = queryClient.getQueryData<Task>(taskKeys.detail(id));
  if (detailCache) {
    queryClient.setQueryData(taskKeys.detail(id), {
      ...detailCache,
      status,
    });
  }
};

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
    queryFn: () => getTasks(params),
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
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
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
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const isOffline = isBrowser && !window.navigator.onLine;

      if (isOffline) {
        enqueueOfflineStatusUpdate({ id, status, queuedAt: Date.now() });

        const cachedTask =
          queryClient.getQueryData<Task>(taskKeys.detail(id)) || findTaskInListCaches(queryClient, id);

        return cachedTask
          ? {
              ...cachedTask,
              status,
            }
          : ({ id, status } as Task);
      }

      return updateTaskStatus(id, status);
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<TasksResponse>({ queryKey: taskKeys.lists() });
      const previousDetail = queryClient.getQueryData<Task>(taskKeys.detail(id));

      applyTaskStatusOptimistically(queryClient, id, status);

      return {
        previousLists,
        previousDetail,
      };
    },
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      if (updatedTask?.id) {
        queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      }

      const shouldInvalidate = !isBrowser || window.navigator.onLine;
      if (shouldInvalidate) {
        queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      }
    },
    onError: (error, { id }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]: [readonly unknown[], TasksResponse | undefined]) => {
          queryClient.setQueryData(key, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(taskKeys.detail(id), context.previousDetail);
      }

      console.error(`Error updating task status ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for flushing offline queued task status updates when connectivity is restored.
 */
export const useFlushOfflineTaskStatusQueue = () => {
  const queryClient = useQueryClient();

  return async (): Promise<number> => {
    if (!isBrowser || !window.navigator.onLine) {
      return 0;
    }

    const queuedUpdates = readOfflineStatusQueue();
    if (queuedUpdates.length === 0) {
      return 0;
    }

    const remainingQueue: OfflineTaskStatusUpdate[] = [];
    let flushedCount = 0;

    for (const update of queuedUpdates) {
      try {
        const updatedTask = await updateTaskStatus(update.id, update.status);
        queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
        flushedCount += 1;
      } catch {
        remainingQueue.push(update);
      }
    }

    writeOfflineStatusQueue(remainingQueue);

    if (flushedCount > 0) {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    }

    return flushedCount;
  };
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
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`Error updating task progress ${id}:`, parseApiError(error));
    },
  });
};
