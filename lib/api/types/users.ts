import { PaginatedResponse } from './common';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  initials: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdDate: string;
  updatedDate: string;
}

export interface UserSkill {
  id: number;
  name: string;
  level: number;
  yearsOfExperience: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
  initials: string;
  department: string;
  bio: string;
  location: string;
  phone: string;
  address: Address;
  skills: UserSkill[];
  createdDate: string;
  updatedDate: string;
}

export interface DevelopmentGoal {
  id: number;
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
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  bio?: string;
  location?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface UsersQueryParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type UsersResponse = PaginatedResponse<User>;
