import { APIRequestContext, expect, test } from '@playwright/test';
import {
  API_BASE_URL,
  authHeaders,
  createTask,
  expectAuthResponseShape,
  expectPaginatedTaskShape,
  expectStrictErrorShape,
  expectTaskShape,
  loginUser,
  makeUniqueCredentials,
  registerUser,
  StrictErrorPayload,
  TaskPayload
} from './helpers/contracts';

const createAuthenticatedSession = async (request: APIRequestContext) => {
  const credentials = makeUniqueCredentials('task-user');
  const registration = await registerUser(request, credentials);

  expect(registration.response.status()).toBe(201);
  expectAuthResponseShape(registration.body);

  return {
    credentials,
    token: registration.body.token as string
  };
};

const createTaskWriterSession = async (request: APIRequestContext) => {
  const adminUsername = process.env.E2E_ADMIN_USERNAME;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  if (adminUsername && adminPassword) {
    const adminLogin = await loginUser(request, adminUsername, adminPassword);

    expect(adminLogin.response.status()).toBe(200);
    expectAuthResponseShape(adminLogin.body);

    return {
      token: adminLogin.body.token as string,
      role: 'Admin' as const
    };
  }

  const userSession = await createAuthenticatedSession(request);
  const probeCreate = await createTask(request, userSession.token, {
    title: `writer-probe-${Date.now()}`
  });

  if (probeCreate.response.status() === 403) {
    test.skip(
      true,
      'Task creation is forbidden for new User role tokens in this environment. Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD to run task contract tests.'
    );
  }

  expect(probeCreate.response.status()).toBe(201);
  expectTaskShape(probeCreate.body);

  return {
    token: userSession.token,
    role: 'User' as const
  };
};

test.describe('Task contract enforcement', () => {
  test('task list enforces paginated shape and uses search query key', async ({ request }) => {
    const session = await createTaskWriterSession(request);
    const marker = `task-search-${Date.now()}`;

    const createdOne = await createTask(request, session.token, {
      title: `${marker}-alpha`,
      description: 'Search marker alpha',
      status: 'blocked',
      priority: 'critical'
    });
    expect(createdOne.response.status()).toBe(201);
    expectTaskShape(createdOne.body);

    const createdTwo = await createTask(request, session.token, {
      title: `${marker}-beta`,
      description: 'Search marker beta',
      status: 'todo',
      priority: 'low'
    });
    expect(createdTwo.response.status()).toBe(201);
    expectTaskShape(createdTwo.body);

    const paginated = await request.get(`${API_BASE_URL}/tasks?page=1&limit=1`, {
      headers: authHeaders(session.token)
    });

    expect(paginated.status()).toBe(200);
    const paginatedBody = await paginated.json();
    expectPaginatedTaskShape(paginatedBody);
    expect(paginatedBody.limit).toBe(1);

    const filtered = await request.get(`${API_BASE_URL}/tasks?search=${encodeURIComponent(marker)}&page=1&limit=20`, {
      headers: authHeaders(session.token)
    });

    expect(filtered.status()).toBe(200);
    const filteredBody = await filtered.json();
    expectPaginatedTaskShape(filteredBody);
    expect(filteredBody.data.length).toBeGreaterThan(0);

    for (const task of filteredBody.data as TaskPayload[]) {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      expect(haystack).toContain(marker.toLowerCase());
    }

    const legacyFilter = await request.get(`${API_BASE_URL}/tasks?searchTerm=${encodeURIComponent(marker)}&page=1&limit=20`, {
      headers: authHeaders(session.token)
    });

    expect(legacyFilter.status()).toBe(200);
    const legacyBody = await legacyFilter.json();
    expectPaginatedTaskShape(legacyBody);
    expect(legacyBody.total).toBeGreaterThanOrEqual(filteredBody.total);
  });

  test('out-of-range progress values are rejected with strict validation error shape', async ({ request }) => {
    const session = await createTaskWriterSession(request);
    const created = await createTask(request, session.token, {
      title: `progress-boundary-${Date.now()}`
    });

    expect(created.response.status()).toBe(201);
    expectTaskShape(created.body);

    const taskId = created.body.id;

    const lowProgress = await request.patch(`${API_BASE_URL}/tasks/${taskId}/progress`, {
      headers: authHeaders(session.token),
      data: { progress: -10 }
    });

    expect(lowProgress.status()).toBe(400);
    const lowBody = await lowProgress.json();
    expectStrictErrorShape(lowBody, 400, 'Validation Error');
    expect(Object.keys((lowBody as StrictErrorPayload).errors ?? {}).length).toBeGreaterThan(0);

    const highProgress = await request.patch(`${API_BASE_URL}/tasks/${taskId}/progress`, {
      headers: authHeaders(session.token),
      data: { progress: 150 }
    });

    expect(highProgress.status()).toBe(400);
    const highBody = await highProgress.json();
    expectStrictErrorShape(highBody, 400, 'Validation Error');
    expect(Object.keys((highBody as StrictErrorPayload).errors ?? {}).length).toBeGreaterThan(0);
  });

  test('status and progress transitions remain contract-aligned', async ({ request }) => {
    const session = await createTaskWriterSession(request);
    const created = await createTask(request, session.token, {
      title: `status-transition-${Date.now()}`
    });

    expect(created.response.status()).toBe(201);
    expectTaskShape(created.body);

    const taskId = created.body.id;

    const inProgress = await request.patch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      headers: authHeaders(session.token),
      data: { status: 'in-progress' }
    });

    expect(inProgress.status()).toBe(200);
    const inProgressBody = await inProgress.json();
    expectTaskShape(inProgressBody);
    expect(inProgressBody.status).toBe('in-progress');

    const completeFromProgress = await request.patch(`${API_BASE_URL}/tasks/${taskId}/progress`, {
      headers: authHeaders(session.token),
      data: { progress: 100 }
    });

    expect(completeFromProgress.status()).toBe(200);
    const completeBody = await completeFromProgress.json();
    expectTaskShape(completeBody);
    expect(completeBody.progress).toBe(100);
    expect(completeBody.status).toBe('completed');

    const resetToTodo = await request.patch(`${API_BASE_URL}/tasks/${taskId}/progress`, {
      headers: authHeaders(session.token),
      data: { progress: 0 }
    });

    expect(resetToTodo.status()).toBe(200);
    const resetBody = await resetToTodo.json();
    expectTaskShape(resetBody);
    expect(resetBody.progress).toBe(0);
    expect(resetBody.status).toBe('todo');
  });

  test('tasks with null assignee remain valid contract payloads', async ({ request }) => {
    const session = await createTaskWriterSession(request);
    const created = await createTask(request, session.token, {
      title: `unassigned-task-${Date.now()}`,
      assigneeId: undefined
    });

    expect(created.response.status()).toBe(201);
    expectTaskShape(created.body);

    const taskId = created.body.id;
    const fetched = await request.get(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: authHeaders(session.token)
    });

    expect(fetched.status()).toBe(200);
    const fetchedBody = await fetched.json();
    expectTaskShape(fetchedBody);
    expect(fetchedBody.assignee).toBeNull();
    expect(fetchedBody.assigneeId).toBeNull();
  });
});
