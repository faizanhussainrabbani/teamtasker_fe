import apiClient from '../client';
import { API_CONFIG } from '../config';
import {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TasksResponse,
  TasksQueryParams
} from '../types/tasks';

const TASKS_ENDPOINT = API_CONFIG.endpoints.tasks;

/**
 * Get all tasks with optional filtering
 */
export const getTasks = async (params?: TasksQueryParams): Promise<TasksResponse> => {
  console.log('getTasks called with params:', params);
  console.log('API URL:', TASKS_ENDPOINT);

  try {
    const response = await apiClient.get(TASKS_ENDPOINT, { params });
    console.log('getTasks response:', response.data);

    // Log the structure of the response to debug
    console.log('Response structure:', {
      hasItems: !!response.data.items,
      hasData: !!response.data.data,
      itemsLength: response.data.items?.length || response.data.data?.length,
      hasPageInfo: !!response.data.pageNumber || !!response.data.page,
      fullStructure: JSON.stringify(response.data, null, 2)
    });

    // Normalize the response to match our expected format
    const normalizedResponse = {
      // If the API returns items, use that, otherwise use data
      items: response.data.items || response.data.data || [],
      // Map pagination fields
      pageNumber: response.data.pageNumber || response.data.page || 1,
      pageSize: response.data.pageSize || response.data.limit || 10,
      totalCount: response.data.totalCount || response.data.total || 0,
      totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (response.data.limit || 10)),
      hasPreviousPage: response.data.hasPreviousPage || ((response.data.page || 1) > 1),
      hasNextPage: response.data.hasNextPage || ((response.data.page || 1) < Math.ceil((response.data.total || 0) / (response.data.limit || 10))),

      // Also include the original fields for compatibility
      data: response.data.data || response.data.items || [],
      page: response.data.page || response.data.pageNumber || 1,
      limit: response.data.limit || response.data.pageSize || 10,
      total: response.data.total || response.data.totalCount || 0
    };

    console.log('Normalized response:', normalizedResponse);

    return normalizedResponse;
  } catch (error) {
    console.error('getTasks error:', error);
    throw error;
  }
};

/**
 * Get a task by ID
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get(`${TASKS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new task
 */
export const createTask = async (task: TaskCreateRequest): Promise<Task> => {
  const response = await apiClient.post(TASKS_ENDPOINT, task);
  return response.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (id: string, task: TaskUpdateRequest): Promise<Task> => {
  const response = await apiClient.patch(`${TASKS_ENDPOINT}/${id}`, task);
  return response.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`${TASKS_ENDPOINT}/${id}`);
};

/**
 * Update task status
 */
export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  const response = await apiClient.patch(`${TASKS_ENDPOINT}/${id}/status`, { status });
  return response.data;
};

/**
 * Update task progress
 */
export const updateTaskProgress = async (id: string, progress: number): Promise<Task> => {
  const response = await apiClient.patch(`${TASKS_ENDPOINT}/${id}/progress`, { progress });
  return response.data;
};
