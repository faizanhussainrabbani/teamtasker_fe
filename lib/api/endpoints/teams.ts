import { apiClient } from '@/lib/api/api-client';
import { 
  TeamDto, 
  TeamDetailDto, 
  TeamCreateUpdateDto, 
  TeamMemberDto, 
  TeamMemberCreateUpdateDto,
  TeamsQueryParams
} from '@/lib/api/types/teams';

/**
 * Get all teams with optional filtering
 */
export const getTeams = async (params?: TeamsQueryParams) => {
  const response = await apiClient.get('/api/teams', { params });
  return response.data;
};

/**
 * Get a specific team by ID with detailed information including members
 */
export const getTeamById = async (id: number): Promise<TeamDetailDto> => {
  const response = await apiClient.get(`/api/teams/${id}`);
  return response.data;
};

/**
 * Create a new team
 */
export const createTeam = async (team: TeamCreateUpdateDto): Promise<TeamDto> => {
  const response = await apiClient.post('/api/teams', team);
  return response.data;
};

/**
 * Update an existing team
 */
export const updateTeam = async (id: number, team: TeamCreateUpdateDto): Promise<void> => {
  await apiClient.put(`/api/teams/${id}`, team);
};

/**
 * Delete a team
 */
export const deleteTeam = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/teams/${id}`);
};

/**
 * Get all members of a specific team
 */
export const getTeamMembers = async (teamId: number): Promise<TeamMemberDto[]> => {
  const response = await apiClient.get(`/api/teams/${teamId}/members`);
  return response.data;
};

/**
 * Add a user to a team
 */
export const addTeamMember = async (
  teamId: number, 
  member: TeamMemberCreateUpdateDto
): Promise<TeamMemberDto> => {
  const response = await apiClient.post(`/api/teams/${teamId}/members`, member);
  return response.data;
};

/**
 * Update a team member's role
 */
export const updateTeamMember = async (
  teamId: number, 
  memberId: number, 
  role: string
): Promise<void> => {
  await apiClient.put(`/api/teams/${teamId}/members/${memberId}`, { role });
};

/**
 * Remove a member from a team
 */
export const removeTeamMember = async (teamId: number, memberId: number): Promise<void> => {
  await apiClient.delete(`/api/teams/${teamId}/members/${memberId}`);
};
