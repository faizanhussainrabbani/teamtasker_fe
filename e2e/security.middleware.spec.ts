import { expect, test } from '@playwright/test';
import {
  API_BASE_URL,
  authHeaders,
  createTask,
  expectAuthResponseShape,
  expectTaskShape,
  loginUser,
  makeUniqueCredentials,
  registerUser
} from './helpers/contracts';

const createLiveAuthCookieToken = () => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    role: 'User',
  };

  const payloadSegment = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${payloadSegment}.signature`;
};

test.describe('Security and middleware behavior', () => {
  test('unauthenticated request to protected route is redirected to login', async ({ request }) => {
    const response = await request.get('/dashboard', { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain('/login');
  });

  test('authenticated cookie request to auth route is redirected to dashboard', async ({ request }) => {
    const authCookie = createLiveAuthCookieToken();

    const response = await request.get('/login', {
      maxRedirects: 0,
      headers: {
        Cookie: `teamtasker_auth=${authCookie}`
      }
    });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain('/dashboard');
  });

  test('localStorage-only token does not bypass middleware guard', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('auth_token', 'header.payload.signature');
      window.localStorage.setItem('auth_refresh_token', 'refresh-token-placeholder');
      window.localStorage.setItem('auth_token_expiry', String(Date.now() + 60 * 60 * 1000));
    });

    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login(\?.*)?$/);
  });

  test('user role can create tasks according to RBAC contract', async ({ request }) => {
    const credentials = makeUniqueCredentials('security-user-create');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);
    expectAuthResponseShape(registration.body);

    const token = registration.body.token as string;
    const createResponse = await createTask(request, token, {
      title: `security-user-create-${Date.now()}`
    });

    expect(createResponse.response.status()).toBe(201);
  });

  test('non-admin user cannot delete task through direct API call', async ({ request }) => {
    const adminUsername = process.env.E2E_ADMIN_USERNAME;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD;

    test.skip(
      !adminUsername || !adminPassword,
      'Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD to run non-admin delete denial coverage.'
    );

    const adminLogin = await loginUser(request, adminUsername as string, adminPassword as string);
    expect(adminLogin.response.status()).toBe(200);
    expectAuthResponseShape(adminLogin.body);

    const adminToken = adminLogin.body.token as string;
    const created = await createTask(request, adminToken, {
      title: `security-delete-${Date.now()}`
    });

    expect(created.response.status()).toBe(201);
    expectTaskShape(created.body);

    const credentials = makeUniqueCredentials('security-user-delete');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);
    expectAuthResponseShape(registration.body);

    const token = registration.body.token as string;

    const deleteResponse = await request.delete(`${API_BASE_URL}/tasks/${created.body.id}`, {
      headers: authHeaders(token)
    });

    expect(deleteResponse.status()).toBe(403);
  });

  test('admin can delete task when admin credentials are provided', async ({ request }) => {
    const adminUsername = process.env.E2E_ADMIN_USERNAME;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD;

    test.skip(
      !adminUsername || !adminPassword,
      'Set E2E_ADMIN_USERNAME and E2E_ADMIN_PASSWORD to run admin-only RBAC coverage.'
    );

    const login = await loginUser(request, adminUsername as string, adminPassword as string);

    expect(login.response.status()).toBe(200);
    expectAuthResponseShape(login.body);

    const adminToken = login.body.token as string;

    const created = await createTask(request, adminToken, {
      title: `admin-delete-${Date.now()}`
    });

    expect(created.response.status()).toBe(201);
    expectTaskShape(created.body);

    const deleteResponse = await request.delete(`${API_BASE_URL}/tasks/${created.body.id}`, {
      headers: authHeaders(adminToken)
    });

    expect(deleteResponse.status()).toBe(204);
  });
});
