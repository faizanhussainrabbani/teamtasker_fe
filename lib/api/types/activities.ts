import { PaginatedResponse } from './common';
import { User } from './users';

export type ActivityType = 'completed' | 'commented' | 'assigned' | 'updated' | 'created' | 'deleted';

export interface Activity {
  id: string;
  user: User;
  action: ActivityType;
  target: string;
  targetId?: string;
  targetType?: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  comment?: string;
  createdAt: string;
  timestamp: string; // Formatted time (e.g., "2 hours ago")
}

export interface ActivitiesQueryParams {
  userId?: string;
  targetType?: string;
  targetId?: string;
  action?: ActivityType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type ActivitiesResponse = PaginatedResponse<Activity>;
