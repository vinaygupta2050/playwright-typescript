import { test, expect } from '../fixtures/api.fixtures';

test.describe('Health Check API', () => {

  test('GET /ping — should return 201 when API is up', async ({ bookingClient }) => {
    const response = await bookingClient.ping();
    expect(response.status()).toBe(201);
  });

});
