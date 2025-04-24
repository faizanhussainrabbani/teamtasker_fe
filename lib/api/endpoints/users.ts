import apiClient from '../client';
import { API_CONFIG } from '../config';
import {
  User,
  UserProfile,
  UserCreateRequest,
  UserUpdateRequest,
  UsersResponse,
  UsersQueryParams,
  UserSkill,
  DevelopmentGoal
} from '../types/users';

const USERS_ENDPOINT = API_CONFIG.endpoints.users;
const PROFILE_ENDPOINT = API_CONFIG.endpoints.profile;
const DEVELOPMENT_GOALS_ENDPOINT = API_CONFIG.endpoints.developmentGoals;

/**
 * Get all users with optional filtering
 */
export const getUsers = async (params?: UsersQueryParams): Promise<UsersResponse> => {
  const response = await apiClient.get(USERS_ENDPOINT, { params });
  return response.data;
};

/**
 * Get a user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`${USERS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new user
 */
export const createUser = async (user: UserCreateRequest): Promise<User> => {
  const response = await apiClient.post(USERS_ENDPOINT, user);
  return response.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (id: string, user: UserUpdateRequest): Promise<User> => {
  const response = await apiClient.patch(`${USERS_ENDPOINT}/${id}`, user);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`${USERS_ENDPOINT}/${id}`);
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get(PROFILE_ENDPOINT);
  return response.data;
};

/**
 * Update current user profile
 */
export const updateCurrentUserProfile = async (profile: UserUpdateRequest): Promise<UserProfile> => {
  const response = await apiClient.patch(PROFILE_ENDPOINT, profile);
  return response.data;
};

/**
 * Update user skills
 */
export const updateUserSkills = async (skills: UserSkill[]): Promise<UserSkill[]> => {
  const response = await apiClient.put(`${PROFILE_ENDPOINT}/skills`, { skills });
  return response.data;
};

/**
 * Get user development goals
 */
export const getUserDevelopmentGoals = async (): Promise<DevelopmentGoal[]> => {
  const response = await apiClient.get(`${DEVELOPMENT_GOALS_ENDPOINT}`);
  return response.data;
};

/**
 * Create development goal
 */
export const createDevelopmentGoal = async (goal: Omit<DevelopmentGoal, 'id'>): Promise<DevelopmentGoal> => {
  const response = await apiClient.post(`${DEVELOPMENT_GOALS_ENDPOINT}`, goal);
  return response.data;
};

/**
 * Update development goal
 */
export const updateDevelopmentGoal = async (id: string, goal: Partial<DevelopmentGoal>): Promise<DevelopmentGoal> => {
  const response = await apiClient.patch(`${DEVELOPMENT_GOALS_ENDPOINT}/${id}`, goal);
  return response.data;
};
