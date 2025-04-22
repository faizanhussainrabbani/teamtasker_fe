import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAnnouncements, 
  getAnnouncementById, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  toggleAnnouncementPin,
  toggleAnnouncementLike
} from '../endpoints/announcements';
import { 
  AnnouncementCreateRequest, 
  AnnouncementUpdateRequest, 
  AnnouncementsQueryParams
} from '../types/announcements';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters: AnnouncementsQueryParams) => [...announcementKeys.lists(), filters] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
};

/**
 * Hook for fetching announcements with filters
 */
export const useAnnouncements = (params?: AnnouncementsQueryParams) => {
  return useQuery({
    queryKey: announcementKeys.list(params || {}),
    queryFn: () => getAnnouncements(params),
    onError: (error) => {
      console.error('Error fetching announcements:', parseApiError(error));
    },
  });
};

/**
 * Hook for fetching a single announcement
 */
export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => getAnnouncementById(id),
    enabled: !!id, // Only run if id is provided
    onError: (error) => {
      console.error(`Error fetching announcement ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for creating a new announcement
 */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (announcement: AnnouncementCreateRequest) => createAnnouncement(announcement),
    onSuccess: () => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating announcement:', parseApiError(error));
    },
  });
};

/**
 * Hook for updating an announcement
 */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AnnouncementUpdateRequest }) => 
      updateAnnouncement(id, data),
    onSuccess: (updatedAnnouncement) => {
      // Update the announcement in the cache
      queryClient.setQueryData(
        announcementKeys.detail(updatedAnnouncement.id),
        updatedAnnouncement
      );
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating announcement:', parseApiError(error));
    },
  });
};

/**
 * Hook for deleting an announcement
 */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: (_, id) => {
      // Remove the announcement from the cache
      queryClient.removeQueries({ queryKey: announcementKeys.detail(id) });
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting announcement:', parseApiError(error));
    },
  });
};

/**
 * Hook for toggling pin status of an announcement
 */
export const useToggleAnnouncementPin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => toggleAnnouncementPin(id),
    onSuccess: (updatedAnnouncement) => {
      // Update the announcement in the cache
      queryClient.setQueryData(
        announcementKeys.detail(updatedAnnouncement.id),
        updatedAnnouncement
      );
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
    onError: (error) => {
      console.error('Error toggling announcement pin:', parseApiError(error));
    },
  });
};

/**
 * Hook for toggling like status of an announcement
 */
export const useToggleAnnouncementLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => toggleAnnouncementLike(id),
    onSuccess: (updatedAnnouncement) => {
      // Update the announcement in the cache
      queryClient.setQueryData(
        announcementKeys.detail(updatedAnnouncement.id),
        updatedAnnouncement
      );
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
    onError: (error) => {
      console.error('Error toggling announcement like:', parseApiError(error));
    },
  });
};
