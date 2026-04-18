import { expect, test } from '@playwright/test';
import { expectAuthResponseShape, makeUniqueCredentials, registerUser } from './helpers/contracts';

test.describe('Task dialog runtime verification', () => {
  test('create and update flows persist through API', async ({ page, request }) => {
    test.slow();

    const credentials = makeUniqueCredentials('task-dialog-ui');
    const titleBase = `task-dialog-${Date.now()}`;
    const createdTitle = `${titleBase}-created`;
    const updatedTitle = `${titleBase}-updated`;

    const registration = await registerUser(request, credentials);
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

    await page.goto('/tasks');
    await expect(page.getByRole('button', { name: 'New Task' })).toBeVisible();

    await page.getByRole('button', { name: 'New Task' }).click();
    await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();

    await page.getByLabel('Task Title').fill(createdTitle);
    await page.getByLabel('Description').fill('Created through runtime verification');

    const createResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/tasks') && response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Create Task' }).click();
    const createResponse = await createResponsePromise;

    expect(createResponse.status()).toBe(201);

    await expect(page.getByText(createdTitle)).toBeVisible();

    await page.getByText(createdTitle).click();
    await expect(page.getByRole('heading', { name: 'Edit Task' })).toBeVisible();

    const titleInput = page.getByLabel('Task Title');
    await titleInput.fill(updatedTitle);

    const updateResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/tasks/') && response.request().method() === 'PATCH'
    );

    await page.getByRole('button', { name: 'Save Changes' }).click();
    const updateResponse = await updateResponsePromise;

    expect(updateResponse.status()).toBe(200);

    await expect(page.getByText(updatedTitle)).toBeVisible();
  });
});
