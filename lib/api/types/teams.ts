import { PaginatedResponse } from './common';

export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  leadId?: string;
  leadName?: string;
  memberCount: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  avatar?: string;
  initials?: string;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
}

export interface TeamsQueryParams {
  page?: number;
  limit?: number;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  department?: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
  department?: string;
  leadId?: string;
}

export interface TeamUpdateRequest extends TeamCreateRequest {
  id: string;
}

export interface AddTeamMemberRequest {
  userId: string;
  role?: string;
}

export interface TeamsResponse extends PaginatedResponse<Team> {
  items?: Team[];
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
