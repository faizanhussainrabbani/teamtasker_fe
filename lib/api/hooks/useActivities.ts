import { useQuery } from '@tanstack/react-query';
import { 
  getActivities, 
  getActivityById
} from '../endpoints/activities';
import { 
  ActivitiesQueryParams
} from '../types/activities';

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
    queryFn: () => getActivities(params),
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
  });
};
