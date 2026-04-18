import { PaginatedResponse } from './common';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  email: string;
  role: string;
  avatar?: string;
  initials?: string;
  department?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface UserSkill {
  id?: string;
  name: string;
  level: number;
  yearsOfExperience?: number;
}

export interface UserProfile extends User {
  skills?: UserSkill[];
  developmentGoals?: DevelopmentGoal[];
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  progress: number;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  department?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface UsersQueryParams {
  role?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export type UsersResponse = PaginatedResponse<User>;
