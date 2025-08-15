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
export const getUserById = async (id: number): Promise<User> => {
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
export const updateUser = async (id: number, user: UserUpdateRequest): Promise<User> => {
  const response = await apiClient.patch(`${USERS_ENDPOINT}/${id}`, user);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`${USERS_ENDPOINT}/${id}`);
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  console.log('🔍 getCurrentUserProfile called, endpoint:', PROFILE_ENDPOINT);
  const response = await apiClient.get(PROFILE_ENDPOINT);
  console.log('✅ getCurrentUserProfile response:', response.data);
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
  // Transform frontend UserSkill format to backend UpdateUserSkillsRequest format
  const requestData = {
    Skills: skills.map(skill => ({
      Name: skill.name,
      Level: skill.level,
      YearsOfExperience: skill.yearsOfExperience
    }))
  };

  const response = await apiClient.put(`${PROFILE_ENDPOINT}/skills`, requestData);
  return response.data;
};


