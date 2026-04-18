import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export const API_BASE_URL = process.env.E2E_API_BASE_URL ?? 'http://localhost:5220/api';

export interface UserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponsePayload {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface StrictErrorPayload {
  status: number;
  title: string;
  detail: string;
  errors?: Record<string, string[]> | null;
}

export interface TaskPayload {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string;
    avatar: string | null;
    initials: string;
  } | null;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

export interface PaginatedTaskPayload {
  data: TaskPayload[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
  tags?: string[];
  projectId?: number;
}

const toRecord = (value: unknown): Record<string, unknown> => {
  expect(value).not.toBeNull();
  expect(typeof value).toBe('object');
  return value as Record<string, unknown>;
};

const readBodySafely = async (response: APIResponse): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const makeUniqueCredentials = (prefix = 'e2e'): UserCredentials => {
  const nonce = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  const usernamePrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);

  return {
    firstName: 'Playwright',
    lastName: 'Tester',
    email: `${prefix}.${nonce}@example.com`,
    username: `${usernamePrefix}${nonce}`.slice(0, 24),
    password: 'SecurePass123!'
  };
};

export const authHeaders = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`
});

export function expectAuthResponseShape(
  payload: unknown,
  options?: {
    allowNullToken?: boolean;
    allowNullRefreshToken?: boolean;
    allowNullExpiresAt?: boolean;
  }
): asserts payload is AuthResponsePayload {
  const record = toRecord(payload);

  expect(Number.isInteger(record.id)).toBe(true);
  expect(typeof record.username).toBe('string');
  expect(typeof record.email).toBe('string');
  expect(typeof record.fullName).toBe('string');
  expect(typeof record.role).toBe('string');

  const allowNullToken = options?.allowNullToken ?? false;
  const allowNullRefreshToken = options?.allowNullRefreshToken ?? false;
  const allowNullExpiresAt = options?.allowNullExpiresAt ?? false;

  if (allowNullToken) {
    expect(record.token === null || typeof record.token === 'string').toBe(true);
  } else {
    expect(typeof record.token).toBe('string');
    expect((record.token as string).length).toBeGreaterThan(10);
  }

  if (allowNullRefreshToken) {
    expect(record.refreshToken === null || typeof record.refreshToken === 'string').toBe(true);
  } else {
    expect(typeof record.refreshToken).toBe('string');
    expect((record.refreshToken as string).length).toBeGreaterThan(10);
  }

  if (allowNullExpiresAt) {
    expect(record.expiresAt === null || typeof record.expiresAt === 'string').toBe(true);
  } else {
    expect(typeof record.expiresAt).toBe('string');
  }
}

export function expectStrictErrorShape(
  payload: unknown,
  expectedStatus: number,
  expectedTitle?: string
): asserts payload is StrictErrorPayload {
  const record = toRecord(payload);

  expect(record).not.toHaveProperty('message');
  expect(record.status).toBe(expectedStatus);
  expect(typeof record.title).toBe('string');
  expect(typeof record.detail).toBe('string');

  if (expectedTitle) {
    expect(record.title).toBe(expectedTitle);
  }

  if ('errors' in record && record.errors !== null && record.errors !== undefined) {
    expect(typeof record.errors).toBe('object');
  }
}

export function expectTaskShape(payload: unknown): asserts payload is TaskPayload {
  const record = toRecord(payload);

  expect(typeof record.id).toBe('string');
  expect(typeof record.title).toBe('string');
  expect(typeof record.description).toBe('string');
  expect(typeof record.status).toBe('string');
  expect(typeof record.priority).toBe('string');
  expect(typeof record.dueDate).toBe('string');
  expect(record.assigneeId === null || typeof record.assigneeId === 'string').toBe(true);
  expect(Array.isArray(record.tags)).toBe(true);
  expect(typeof record.progress).toBe('number');
  expect(typeof record.createdAt).toBe('string');
  expect(typeof record.updatedAt).toBe('string');
  expect(Number.isInteger(record.projectId)).toBe(true);

  if (record.assignee !== null) {
    const assignee = toRecord(record.assignee);
    expect(typeof assignee.id).toBe('string');
    expect(typeof assignee.name).toBe('string');
    expect(assignee.avatar === null || typeof assignee.avatar === 'string').toBe(true);
    expect(typeof assignee.initials).toBe('string');
  }
}

export function expectPaginatedTaskShape(payload: unknown): asserts payload is PaginatedTaskPayload {
  const record = toRecord(payload);

  expect(Array.isArray(record.data)).toBe(true);
  expect(typeof record.total).toBe('number');
  expect(typeof record.page).toBe('number');
  expect(typeof record.limit).toBe('number');
  expect(typeof record.totalPages).toBe('number');

  const data = record.data as unknown[];
  for (const task of data) {
    expectTaskShape(task);
  }
}

export const registerUser = async (
  request: APIRequestContext,
  credentials: UserCredentials
): Promise<{ response: APIResponse; body: unknown }> => {
  const response = await request.post(`${API_BASE_URL}/auth/register`, {
    data: credentials
  });

  const body = await readBodySafely(response);
  return { response, body };
};

export const loginUser = async (
  request: APIRequestContext,
  username: string,
  password: string
): Promise<{ response: APIResponse; body: unknown }> => {
  const response = await request.post(`${API_BASE_URL}/auth/login`, {
    data: { username, password }
  });

  const body = await readBodySafely(response);
  return { response, body };
};

export const createTask = async (
  request: APIRequestContext,
  token: string,
  input?: Partial<CreateTaskRequest>
): Promise<{ response: APIResponse; body: unknown; payload: CreateTaskRequest }> => {
  const payload: CreateTaskRequest = {
    title: `Playwright task ${Date.now()}`,
    description: 'Created by Playwright strict contract tests',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    tags: [],
    ...input
  };

  const response = await request.post(`${API_BASE_URL}/tasks`, {
    headers: authHeaders(token),
    data: payload
  });

  const body = await readBodySafely(response);
  return { response, body, payload };
};
