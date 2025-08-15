import { PaginatedResponse } from './common';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  progress: number;

  // Project information
  projectId: number;
  projectName: string;
  project?: {
    id: number;
    name: string;
    color?: string;
  };

  // Assignee information (new structure)
  assigneeTeamMemberId?: number;
  assigneeId?: number; // Deprecated but kept for compatibility
  assignee?: {
    id: number;
    name: string;
    avatar: string;
    initials: string;
    teamMemberId?: number;
    teamId?: number;
    teamRole?: string;
  };

  // Legacy team member structure (kept for compatibility)
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

  // Creator information (new structure)
  creatorTeamMemberId?: number;
  creatorId?: number; // Deprecated but kept for compatibility
  creator?: {
    id: number;
    name: string;
    avatar: string;
    initials: string;
    teamMemberId?: number;
    teamId?: number;
    teamRole?: string;
  };

  // Task metadata
  tags: string[];
  createdDate: string;
  updatedDate: string;
  completedDate?: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  progress?: number;
  projectId?: number | null;

  // Assignment options (use either assigneeId OR assigneeTeamMemberId)
  assigneeId?: number | null; // Deprecated but kept for compatibility
  assigneeTeamMemberId?: number | null; // Preferred method
  teamMemberId?: number | null; // Legacy field

  tags?: string[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  progress?: number;

  // Assignment options (use either assigneeId OR assigneeTeamMemberId)
  assigneeId?: number; // Deprecated but kept for compatibility
  assigneeTeamMemberId?: number; // Preferred method
  teamMemberId?: number; // Legacy field

  tags?: string[];
}

export type TaskType = 'my' | 'team' | 'created' | 'unassigned' | 'all';

export interface TasksQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  taskType?: TaskType;

  // Additional parameters used in our application
  pageNumber?: number;
  pageSize?: number;
  includeTags?: boolean;
  includeAssignee?: boolean;
  includeCreator?: boolean;
  includeProject?: boolean;
  dueDate?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  projectId?: number;
  teamId?: number;
  progress?: number;
}

export type TasksResponse = PaginatedResponse<Task> | Task[] | Task;
