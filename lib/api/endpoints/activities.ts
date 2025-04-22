import apiClient from '../client';
import { API_CONFIG } from '../config';
import {
  Activity,
  ActivitiesResponse,
  ActivitiesQueryParams
} from '../types/activities';

const ACTIVITIES_ENDPOINT = API_CONFIG.endpoints.activities;

/**
 * Get all activities with optional filtering
 */
export const getActivities = async (params?: ActivitiesQueryParams): Promise<ActivitiesResponse> => {
  const response = await apiClient.get(ACTIVITIES_ENDPOINT, { params });
  return response.data;
};

/**
 * Get a activity by ID
 */
export const getActivityById = async (id: string): Promise<Activity> => {
  const response = await apiClient.get(`${ACTIVITIES_ENDPOINT}/${id}`);
  return response.data;
};
