import { PaginatedResponse } from './common';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  teamMemberId?: number;
  teamMember?: {
    id: number;
    userId: number;
    teamId: number;
    role: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
      initials?: string;
    };
    team: {
      id: number;
      name: string;
    };
  };
  creatorId?: string;
  creator?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  project?: {
    id: string;
    name: string;
    color?: string;
  };
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  teamMemberId?: number;
  tags?: string[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  teamMemberId?: number;
  tags?: string[];
  progress?: number;
}

export type TaskType = 'my' | 'team' | 'created' | 'unassigned' | 'all';

export interface TasksQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  type?: TaskType;
}

export type TasksResponse = PaginatedResponse<Task>;
