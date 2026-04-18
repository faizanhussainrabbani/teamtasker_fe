import { PaginatedResponse } from './common';

export type ProjectStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedToUserId?: number;
}

export interface ProjectDetail extends Project {
  tasks: ProjectTask[];
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectUpdateRequest {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: ProjectStatus;
}

export type ProjectsResponse = PaginatedResponse<Project>;
