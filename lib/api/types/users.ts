import { PaginatedResponse } from './common';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  initials: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSkill {
  name: string;
  level: number;
}

export interface UserProfile extends User {
  skills: UserSkill[];
  developmentGoals: DevelopmentGoal[];
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

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface UsersQueryParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type UsersResponse = PaginatedResponse<User>;
