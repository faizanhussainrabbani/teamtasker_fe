import apiClient from '../client';
import { API_CONFIG } from '../config';
import { 
  Announcement,
  AnnouncementCreateRequest,
  AnnouncementUpdateRequest,
  AnnouncementsResponse,
  AnnouncementsQueryParams
} from '../types/announcements';

const COMMUNICATION_ENDPOINT = API_CONFIG.endpoints.communication;
const ANNOUNCEMENTS_ENDPOINT = `${COMMUNICATION_ENDPOINT}/announcements`;

/**
 * Get all announcements with optional filtering
 */
export const getAnnouncements = async (params?: AnnouncementsQueryParams): Promise<AnnouncementsResponse> => {
  const response = await apiClient.get(ANNOUNCEMENTS_ENDPOINT, { params });
  return response.data;
};

/**
 * Get an announcement by ID
 */
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  const response = await apiClient.get(`${ANNOUNCEMENTS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new announcement
 */
export const createAnnouncement = async (announcement: AnnouncementCreateRequest): Promise<Announcement> => {
  const response = await apiClient.post(ANNOUNCEMENTS_ENDPOINT, announcement);
  return response.data;
};

/**
 * Update an existing announcement
 */
export const updateAnnouncement = async (id: string, announcement: AnnouncementUpdateRequest): Promise<Announcement> => {
  const response = await apiClient.patch(`${ANNOUNCEMENTS_ENDPOINT}/${id}`, announcement);
  return response.data;
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  await apiClient.delete(`${ANNOUNCEMENTS_ENDPOINT}/${id}`);
};

/**
 * Toggle pin status of an announcement
 */
export const toggleAnnouncementPin = async (id: string): Promise<Announcement> => {
  const response = await apiClient.post(`${ANNOUNCEMENTS_ENDPOINT}/${id}/toggle-pin`);
  return response.data;
};

/**
 * Toggle like status of an announcement
 */
export const toggleAnnouncementLike = async (id: string): Promise<Announcement> => {
  const response = await apiClient.post(`${ANNOUNCEMENTS_ENDPOINT}/${id}/toggle-like`);
  return response.data;
};
