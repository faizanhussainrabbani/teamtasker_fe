import { PaginatedResponse } from './common';
import { User } from './users';

export type ActivityType = 'completed' | 'commented' | 'assigned' | 'updated' | 'created' | 'deleted';

export interface Activity {
  id: number;
  user: User;
  action: ActivityType;
  target: string;
  targetId?: number;
  targetType?: string;
  assigneeId?: number;
  assignee?: {
    id: number;
    name: string;
    avatar: string;
    initials: string;
  };
  comment?: string;
  createdDate: string;
  timestamp: string; // Formatted time (e.g., "2 hours ago")
}

export interface ActivitiesQueryParams {
  userId?: number;
  targetType?: string;
  targetId?: number;
  action?: ActivityType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type ActivitiesResponse = PaginatedResponse<Activity>;
