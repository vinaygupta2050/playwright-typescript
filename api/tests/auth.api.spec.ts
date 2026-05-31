import { test, expect, API_CREDENTIALS } from '../fixtures/api.fixtures';

test.describe('Auth API', () => {

  test('POST /auth — should return token with valid credentials', async ({ bookingClient }) => {
    const response = await bookingClient.createToken(API_CREDENTIALS);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /auth — should return bad credentials message with wrong password', async ({ bookingClient }) => {
    const response = await bookingClient.createToken({
      username: 'admin',
      password: 'wrongpassword',
    });

    expect(response.status()).toBe(200); // API returns 200 even for bad creds
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth — should return bad credentials for unknown user', async ({ bookingClient }) => {
    const response = await bookingClient.createToken({
      username: 'unknownuser',
      password: 'somepassword',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

});
