import apiClient from '../client';
import { API_CONFIG } from '../config';
import {
  AddTeamMemberRequest,
  Team,
  TeamCreateRequest,
  TeamDetail,
  TeamMember,
  TeamsQueryParams,
  TeamsResponse,
  TeamUpdateRequest,
} from '../types/teams';

const TEAMS_ENDPOINT = API_CONFIG.endpoints.teams;

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
};

const toStringValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const toNumberValue = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toOptionalId = (value: unknown): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return String(parsed);
};

const mapTeam = (input: unknown): Team => {
  const team = asRecord(input);

  return {
    id: toStringValue(team.id),
    name: toStringValue(team.name),
    description: toStringValue(team.description),
    department: toStringValue(team.department),
    leadId: toOptionalId(team.leadId),
    leadName: toStringValue(team.leadName) || undefined,
    memberCount: toNumberValue(team.memberCount),
    createdDate: toStringValue(team.createdDate) || undefined,
    updatedDate: toStringValue(team.updatedDate) || undefined,
  };
};

const mapTeamMember = (input: unknown): TeamMember => {
  const member = asRecord(input);

  return {
    userId: toStringValue(member.userId),
    name: toStringValue(member.name),
    email: toStringValue(member.email),
    role: toStringValue(member.role),
    joinedDate: toStringValue(member.joinedDate),
    avatar: toStringValue(member.avatar) || undefined,
    initials: toStringValue(member.initials) || undefined,
  };
};

const mapTeamDetail = (input: unknown): TeamDetail => {
  const detail = asRecord(input);
  const membersRaw = Array.isArray(detail.members) ? detail.members : [];

  return {
    ...mapTeam(detail),
    members: membersRaw.map(mapTeamMember),
  };
};

const normalizeTeamsResponse = (input: unknown): TeamsResponse => {
  const data = asRecord(input);

  const rawItems = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.items)
      ? data.items
      : [];

  const teams = rawItems.map(mapTeam);

  const page = toNumberValue(data.page) || toNumberValue(data.pageNumber) || 1;
  const limit = toNumberValue(data.limit) || toNumberValue(data.pageSize) || 10;
  const total = toNumberValue(data.total) || toNumberValue(data.totalCount) || teams.length;
  const totalPages = toNumberValue(data.totalPages) || (limit > 0 ? Math.ceil(total / limit) : 0);

  return {
    data: teams,
    items: teams,
    total,
    totalCount: total,
    page,
    pageNumber: page,
    limit,
    pageSize: limit,
    totalPages,
    hasPreviousPage: Boolean(data.hasPreviousPage),
    hasNextPage: Boolean(data.hasNextPage),
  };
};

const toLeadId = (leadId?: string): number | null => {
  if (!leadId) {
    return null;
  }

  const parsed = Number(leadId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const toTeamPayload = (payload: TeamCreateRequest | TeamUpdateRequest): Record<string, unknown> => {
  const normalized = {
    name: payload.name.trim(),
    description: payload.description?.trim() || '',
    department: payload.department?.trim() || '',
    leadId: toLeadId(payload.leadId),
  } as Record<string, unknown>;

  if ('id' in payload) {
    normalized.id = Number(payload.id);
  }

  return normalized;
};

const toTeamQueryParams = (params?: TeamsQueryParams): Record<string, unknown> | undefined => {
  if (!params) {
    return undefined;
  }

  return {
    pageNumber: params.pageNumber ?? params.page,
    pageSize: params.pageSize ?? params.limit,
    searchTerm: params.searchTerm,
    department: params.department,
  };
};

export const getTeams = async (params?: TeamsQueryParams): Promise<TeamsResponse> => {
  const response = await apiClient.get(TEAMS_ENDPOINT, {
    params: toTeamQueryParams(params),
  });

  return normalizeTeamsResponse(response.data);
};

export const getTeamById = async (id: string): Promise<TeamDetail> => {
  const response = await apiClient.get(`${TEAMS_ENDPOINT}/${id}`);
  return mapTeamDetail(response.data);
};

export const createTeam = async (team: TeamCreateRequest): Promise<TeamDetail> => {
  const response = await apiClient.post(TEAMS_ENDPOINT, toTeamPayload(team));
  const createdId = toStringValue(response.data);
  return getTeamById(createdId);
};

export const updateTeam = async (team: TeamUpdateRequest): Promise<TeamDetail> => {
  await apiClient.put(`${TEAMS_ENDPOINT}/${team.id}`, toTeamPayload(team));
  return getTeamById(team.id);
};

export const deleteTeam = async (id: string): Promise<void> => {
  await apiClient.delete(`${TEAMS_ENDPOINT}/${id}`);
};

export const addTeamMember = async (
  teamId: string,
  payload: AddTeamMemberRequest,
): Promise<TeamMember> => {
  const response = await apiClient.post(`${TEAMS_ENDPOINT}/${teamId}/members`, {
    userId: Number(payload.userId),
    role: payload.role?.trim() || 'Member',
  });

  return mapTeamMember(response.data);
};

export const removeTeamMember = async (teamId: string, userId: string): Promise<void> => {
  await apiClient.delete(`${TEAMS_ENDPOINT}/${teamId}/members/${userId}`);
};
