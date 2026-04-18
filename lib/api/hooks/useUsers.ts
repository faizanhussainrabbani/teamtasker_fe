import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUsers, 
  getUserById, 
  getCurrentUserProfile,
  updateCurrentUserProfile
} from '../endpoints/users';
import { 
  UserUpdateRequest, 
  UsersQueryParams
} from '../types/users';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UsersQueryParams) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

/**
 * Hook for fetching users with filters
 */
export const useUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
  });
};

/**
 * Hook for fetching a single user
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id, // Only run if id is provided
  });
};

/**
 * Hook for fetching current user profile
 */
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getCurrentUserProfile(),
  });
};

/**
 * Hook for updating current user profile
 */
export const useUpdateCurrentUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profile: UserUpdateRequest) => updateCurrentUserProfile(profile),
    onSuccess: (updatedProfile) => {
      // Update the profile in the cache
      queryClient.setQueryData(userKeys.profile(), updatedProfile);
    },
    onError: (error) => {
      console.error('Error updating user profile:', parseApiError(error));
    },
  });
};
