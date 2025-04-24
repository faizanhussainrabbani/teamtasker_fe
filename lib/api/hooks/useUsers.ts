import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserSkills
} from '../endpoints/users';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UsersQueryParams,
  UserSkill
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
  skills: () => [...userKeys.profile(), 'skills'] as const,
};

/**
 * Hook for fetching users with filters
 */
export const useUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
    onError: (error) => {
      console.error('Error fetching users:', parseApiError(error));
    },
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
    onError: (error) => {
      console.error(`Error fetching user ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for creating a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: UserCreateRequest) => createUser(newUser),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating user:', parseApiError(error));
    },
  });
};

/**
 * Hook for updating a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserUpdateRequest }) =>
      updateUser(id, user),
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`Error updating user ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for deleting a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_, id) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error, id) => {
      console.error(`Error deleting user ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for fetching current user profile
 */
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getCurrentUserProfile(),
    onError: (error) => {
      console.error('Error fetching user profile:', parseApiError(error));
    },
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

/**
 * Hook for updating user skills
 */
export const useUpdateUserSkills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skills: UserSkill[]) => updateUserSkills(skills),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error('Error updating user skills:', parseApiError(error));
    },
  });
};


