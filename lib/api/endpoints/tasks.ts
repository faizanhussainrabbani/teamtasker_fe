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
  console.log('🔍 getTasks called with params:', params);
  console.log('🔍 API URL:', `${apiClient.defaults.baseURL}${TASKS_ENDPOINT}`);

  try {
    console.log('🔍 Making API request to:', `${apiClient.defaults.baseURL}${TASKS_ENDPOINT}`);
    const response = await apiClient.get(TASKS_ENDPOINT, { params });
    console.log('✅ getTasks raw response:', response);
    console.log('✅ getTasks response data:', response.data);

    // Check if response is empty or undefined
    if (!response.data) {
      console.error('❌ Empty response data received');
      return {
        items: [],
        data: [],
        pageNumber: 1,
        page: 1,
        pageSize: 10,
        limit: 10,
        totalCount: 0,
        total: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    // Log the structure of the response to debug
    console.log('🔍 Response structure:', {
      type: typeof response.data,
      isArray: Array.isArray(response.data),
      hasItems: !!response.data.items,
      hasData: !!response.data.data,
      itemsLength: response.data.items?.length || response.data.data?.length,
      hasPageInfo: !!response.data.pageNumber || !!response.data.page,
      keys: Object.keys(response.data),
      fullStructure: JSON.stringify(response.data, null, 2)
    });

    // Handle if response.data is an array directly
    if (Array.isArray(response.data)) {
      console.log('🔍 Response is a direct array, wrapping it');
      const wrappedResponse = {
        items: response.data,
        data: response.data,
        pageNumber: 1,
        page: 1,
        pageSize: response.data.length,
        limit: response.data.length,
        totalCount: response.data.length,
        total: response.data.length,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      };
      console.log('✅ Wrapped array response:', wrappedResponse);
      return wrappedResponse;
    }

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

    console.log('✅ Normalized response:', normalizedResponse);

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
