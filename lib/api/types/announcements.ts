import { PaginatedResponse } from './common';
import { User } from './users';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role?: string;
    avatar: string;
    initials: string;
  };
  date: string;
  isPinned: boolean;
  likes: number;
  hasLiked: boolean;
}

export interface AnnouncementCreateRequest {
  title: string;
  content: string;
  isPinned?: boolean;
}

export interface AnnouncementUpdateRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
}

export interface AnnouncementsQueryParams {
  search?: string;
  isPinned?: boolean;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type AnnouncementsResponse = PaginatedResponse<Announcement>;
