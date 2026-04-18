import { expect, test } from '@playwright/test';
import {
  API_BASE_URL,
  authHeaders,
  expectAuthResponseShape,
  expectStrictErrorShape,
  loginUser,
  makeUniqueCredentials,
  registerUser,
  StrictErrorPayload
} from './helpers/contracts';

test.describe('Auth contract enforcement', () => {
  test('register returns HTTP 201 with strict auth payload', async ({ request }) => {
    const credentials = makeUniqueCredentials('auth-register');
    const { response, body } = await registerUser(request, credentials);

    expect(response.status()).toBe(201);
    expectAuthResponseShape(body);

    expect(body.username).toBe(credentials.username);
    expect(body.email).toBe(credentials.email);
    expect(body.fullName).toBe(`${credentials.firstName} ${credentials.lastName}`);
    expect(body.role).toBe('User');
  });

  test('login accepts username and email paths with strict payload', async ({ request }) => {
    const credentials = makeUniqueCredentials('auth-login');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);
    expectAuthResponseShape(registration.body);

    const loginByUsername = await loginUser(request, credentials.username, credentials.password);
    expect(loginByUsername.response.status()).toBe(200);
    expectAuthResponseShape(loginByUsername.body);

    const loginByEmail = await loginUser(request, credentials.email, credentials.password);
    expect(loginByEmail.response.status()).toBe(200);
    expectAuthResponseShape(loginByEmail.body);
  });

  test('invalid login must return strict unauthorized error shape', async ({ request }) => {
    const credentials = makeUniqueCredentials('auth-invalid-login');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);

    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        username: credentials.username,
        password: `${credentials.password}-invalid`
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expectStrictErrorShape(body, 401, 'Unauthorized');

    const unauthorized = body as StrictErrorPayload;
    expect(unauthorized.detail.toLowerCase()).toContain('invalid username or password');
  });

  test('refresh rotates tokens and replayed token is rejected with strict error shape', async ({ request }) => {
    const credentials = makeUniqueCredentials('auth-refresh');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);
    expectAuthResponseShape(registration.body);

    const originalRefreshToken = registration.body.refreshToken as string;

    const refreshed = await request.post(`${API_BASE_URL}/auth/refresh-token`, {
      data: {
        refreshToken: originalRefreshToken
      }
    });

    expect(refreshed.status()).toBe(200);
    const refreshedBody = await refreshed.json();
    expectAuthResponseShape(refreshedBody);
    expect(refreshedBody.refreshToken).not.toBe(originalRefreshToken);

    const replayResponse = await request.post(`${API_BASE_URL}/auth/refresh-token`, {
      data: {
        refreshToken: originalRefreshToken
      }
    });

    expect(replayResponse.status()).toBe(401);
    const replayBody = await replayResponse.json();
    expectStrictErrorShape(replayBody, 401, 'Unauthorized');
  });

  test('auth me returns profile with null token fields', async ({ request }) => {
    const credentials = makeUniqueCredentials('auth-me');
    const registration = await registerUser(request, credentials);

    expect(registration.response.status()).toBe(201);
    expectAuthResponseShape(registration.body);

    const meResponse = await request.get(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(registration.body.token as string)
    });

    expect(meResponse.status()).toBe(200);
    const meBody = await meResponse.json();
    expectAuthResponseShape(meBody, {
      allowNullToken: true,
      allowNullRefreshToken: true,
      allowNullExpiresAt: true
    });

    expect(meBody.token).toBeNull();
    expect(meBody.refreshToken).toBeNull();
    expect(meBody.expiresAt).toBeNull();
  });
});
