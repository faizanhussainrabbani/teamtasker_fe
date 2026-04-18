import apiClient from '../client';
import { API_CONFIG } from '../config';
import {
  Project,
  ProjectCreateRequest,
  ProjectDetail,
  ProjectsQueryParams,
  ProjectsResponse,
  ProjectStatus,
  ProjectUpdateRequest,
} from '../types/projects';

const PROJECTS_ENDPOINT = API_CONFIG.endpoints.projects;

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

const normalizeProjectStatus = (value: unknown): ProjectStatus => {
  const raw = String(value ?? '').trim().toLowerCase().replace(/[_\s]/g, '-');

  switch (raw) {
    case 'notstarted':
    case 'not-started':
      return 'not-started';
    case 'inprogress':
    case 'in-progress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'onhold':
    case 'on-hold':
      return 'on-hold';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'not-started';
  }
};

const mapProject = (projectInput: unknown): Project => {
  const project = asRecord(projectInput);

  const endDate = project.endDate;

  return {
    id: toStringValue(project.id),
    name: toStringValue(project.name),
    description: toStringValue(project.description),
    startDate: toStringValue(project.startDate),
    endDate: typeof endDate === 'string' ? endDate : undefined,
    status: normalizeProjectStatus(project.status),
  };
};

const mapProjectDetail = (projectInput: unknown): ProjectDetail => {
  const project = asRecord(projectInput);

  return {
    ...mapProject(project),
    tasks: Array.isArray(project.tasks)
      ? project.tasks.map((taskInput) => {
          const task = asRecord(taskInput);

          return {
            id: toStringValue(task.id),
            title: toStringValue(task.title),
            description: toStringValue(task.description),
            dueDate: toStringValue(task.dueDate),
            status: toStringValue(task.status),
            priority: toStringValue(task.priority),
            assignedToUserId: typeof task.assignedToUserId === 'number' ? task.assignedToUserId : undefined,
          };
        })
      : [],
  };
};

const toCreateOrUpdatePayload = (
  project: ProjectCreateRequest | ProjectUpdateRequest,
  id?: string,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    name: project.name.trim(),
    description: project.description?.trim() ?? '',
    startDate: project.startDate,
    endDate: project.endDate || null,
  };

  if (id) {
    payload.id = Number(id);
  }

  return payload;
};

export const getProjects = async (params?: ProjectsQueryParams): Promise<ProjectsResponse> => {
  const response = await apiClient.get(PROJECTS_ENDPOINT, { params });

  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(mapProject) : [],
  };
};

export const getProjectById = async (id: string): Promise<ProjectDetail> => {
  const response = await apiClient.get(`${PROJECTS_ENDPOINT}/${id}`);
  return mapProjectDetail(response.data);
};

export const createProject = async (project: ProjectCreateRequest): Promise<ProjectDetail> => {
  const createResponse = await apiClient.post(
    PROJECTS_ENDPOINT,
    toCreateOrUpdatePayload(project),
  );

  const projectId = String(createResponse.data);
  return getProjectById(projectId);
};

export const updateProject = async (project: ProjectUpdateRequest): Promise<ProjectDetail> => {
  await apiClient.put(
    `${PROJECTS_ENDPOINT}/${project.id}`,
    toCreateOrUpdatePayload(project, project.id),
  );

  return getProjectById(project.id);
};

export const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<Project> => {
  const response = await apiClient.patch(`${PROJECTS_ENDPOINT}/${id}/status`, { status });
  return mapProject(response.data);
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`${PROJECTS_ENDPOINT}/${id}`);
};
