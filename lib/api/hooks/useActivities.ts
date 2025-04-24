import { useQuery } from '@tanstack/react-query';
import {
  getActivities,
  getActivityById
} from '../endpoints/activities';
import {
  ActivitiesQueryParams
} from '../types/activities';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: ActivitiesQueryParams) => [...activityKeys.lists(), filters] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

/**
 * Hook for fetching activities with filters
 */
export const useActivities = (params?: ActivitiesQueryParams) => {
  return useQuery({
    queryKey: activityKeys.list(params || {}),
    queryFn: async () => {
      try {
        return await getActivities(params);
      } catch (error: any) {
        // If it's a 404 error, return empty data instead of throwing
        if (error.response?.status === 404) {
          return { data: [], total: 0, page: 1, limit: params?.limit || 10 };
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('Error fetching activities:', parseApiError(error));
    },
  });
};

/**
 * Hook for fetching a single activity
 */
export const useActivity = (id: string) => {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => getActivityById(id),
    enabled: !!id, // Only run if id is provided
    onError: (error) => {
      console.error(`Error fetching activity ${id}:`, parseApiError(error));
    },
  });
};
