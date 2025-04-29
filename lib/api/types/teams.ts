/**
 * Team-related type definitions
 */

import { User } from './users';

/**
 * Basic team information
 */
export interface TeamDto {
  id: number;
  name: string;
  description: string;
  department: string;
  leadId: number;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Minimal user information for team members
 */
export interface UserMinimalDto {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

/**
 * Team member information
 */
export interface TeamMemberDto {
  id: number;
  teamId: number;
  userId: number;
  role: string;
  user: UserMinimalDto;
  joinedAt: string;
}

/**
 * Detailed team information including members
 */
export interface TeamDetailDto extends TeamDto {
  members: TeamMemberDto[];
  lead?: UserMinimalDto;
}

/**
 * Request body for creating/updating a team
 */
export interface TeamCreateUpdateDto {
  name: string;
  description: string;
  department: string;
  leadId?: number;
}

/**
 * Request body for adding/updating a team member
 */
export interface TeamMemberCreateUpdateDto {
  userId: number;
  role: string;
}

/**
 * Team member role options
 */
export type TeamMemberRole = 'Member' | 'Admin' | 'Lead';

/**
 * Query parameters for team listing
 */
export interface TeamsQueryParams {
  search?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
