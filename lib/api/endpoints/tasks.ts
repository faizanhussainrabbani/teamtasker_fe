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
  const response = await apiClient.get(TASKS_ENDPOINT, { params });
  return response.data;
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
