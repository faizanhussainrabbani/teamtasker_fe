import { expect, Page, test } from '@playwright/test';
import {
  API_BASE_URL,
  authHeaders,
  expectAuthResponseShape,
  makeUniqueCredentials,
  registerUser,
} from './helpers/contracts';

const PROFILE_SUBRESOURCE_PATHS = [
  '/api/users/profile/skills',
  '/api/users/profile/development-goals',
];

const seedAuthenticatedBrowserState = async (page: Page) => {
  const credentials = makeUniqueCredentials('surface-runtime');
  const registration = await registerUser(page.request, credentials);

  expect(registration.response.status()).toBe(201);
  expectAuthResponseShape(registration.body);

  const token = registration.body.token as string;
  const refreshToken = registration.body.refreshToken as string;
  const tokenExpiry = Date.now() + 60 * 60 * 1000;

  await page.context().addCookies([
    {
      name: 'teamtasker_auth',
      value: token,
      domain: 'localhost',
      path: '/',
      sameSite: 'Lax',
      secure: false,
    },
  ]);

  await page.addInitScript(
    ({ seededToken, seededRefreshToken, seededExpiry }) => {
      window.localStorage.setItem('auth_token', seededToken);
      window.localStorage.setItem('auth_refresh_token', seededRefreshToken);
      window.localStorage.setItem('auth_token_expiry', String(seededExpiry));
    },
    {
      seededToken: token,
      seededRefreshToken: refreshToken,
      seededExpiry: tokenExpiry,
    }
  );

  return { token };
};

const trackApiRequests = (page: Page) => {
  const requests: string[] = [];

  page.on('request', (request) => {
    const url = request.url();

    if (url.includes('/api/')) {
      requests.push(`${request.method()} ${url}`);
    }
  });

  return requests;
};

test.describe('Runtime surface contracts', () => {
  test('team page uses users and tasks APIs, not teams API', async ({ page }) => {
    test.slow();

    await seedAuthenticatedBrowserState(page);

    const apiRequests = trackApiRequests(page);
    const usersResponse = page.waitForResponse(
      (response) => response.url().includes('/api/users') && response.request().method() === 'GET'
    );
    const tasksResponse = page.waitForResponse(
      (response) => response.url().includes('/api/tasks') && response.request().method() === 'GET'
    );

    await page.goto('/team');

    await expect(page.getByText('Team Performance')).toBeVisible();

    expect((await usersResponse).status()).toBe(200);
    expect((await tasksResponse).status()).toBe(200);

    const hasTeamsApiCall = apiRequests.some((entry) => entry.includes('/api/teams'));
    expect(hasTeamsApiCall).toBe(false);
  });

  test('development and dashboard routes avoid missing profile subresource endpoints', async ({ page }) => {
    test.slow();

    await seedAuthenticatedBrowserState(page);

    const apiRequests = trackApiRequests(page);

    await page.goto('/development');
    await expect(page.getByRole('heading', { name: 'Development' })).toBeVisible();

    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    const hasProfileSubresourceCall = apiRequests.some((entry) =>
      PROFILE_SUBRESOURCE_PATHS.some((path) => entry.includes(path))
    );

    expect(hasProfileSubresourceCall).toBe(false);
  });

  test('missing profile subresource endpoints return 404 while profile UI remains stable', async ({ page, request }) => {
    test.slow();

    const { token } = await seedAuthenticatedBrowserState(page);

    const skillsResponse = await request.put(`${API_BASE_URL}/users/profile/skills`, {
      headers: authHeaders(token),
      data: {
        skills: [],
      },
    });

    const goalsResponse = await request.get(`${API_BASE_URL}/users/profile/development-goals`, {
      headers: authHeaders(token),
    });

    expect(skillsResponse.status()).toBe(404);
    expect(goalsResponse.status()).toBe(404);

    const apiRequests = trackApiRequests(page);

    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

    const hasProfileSubresourceCall = apiRequests.some((entry) =>
      PROFILE_SUBRESOURCE_PATHS.some((path) => entry.includes(path))
    );

    expect(hasProfileSubresourceCall).toBe(false);
  });
});
