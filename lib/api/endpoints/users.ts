import apiClient from '../client';
import { API_CONFIG } from '../config';
import { 
  User, 
  UserProfile,
  UserUpdateRequest, 
  UsersResponse,
  UsersQueryParams
} from '../types/users';

const USERS_ENDPOINT = API_CONFIG.endpoints.users;
const PROFILE_ENDPOINT = API_CONFIG.endpoints.profile;

/**
 * Get all users with optional filtering
 */
export const getUsers = async (params?: UsersQueryParams): Promise<UsersResponse> => {
  const normalizedParams = {
    ...params,
    pageNumber: params?.pageNumber ?? params?.page,
    pageSize: params?.pageSize ?? params?.limit,
  };

  const response = await apiClient.get(USERS_ENDPOINT, { params: normalizedParams });
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
  const firstName = profile.firstName ?? (profile.name ? profile.name.split(' ').slice(0, -1).join(' ') || profile.name : undefined);
  const lastName = profile.lastName ?? (profile.name ? profile.name.split(' ').slice(-1).join(' ') : undefined);

  const payload = {
    firstName,
    lastName,
    email: profile.email,
    department: profile.department,
    bio: profile.bio,
    location: profile.location,
    phone: profile.phone,
  };

  const response = await apiClient.patch(PROFILE_ENDPOINT, payload);
  return response.data;
};
