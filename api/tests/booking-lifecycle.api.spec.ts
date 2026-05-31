import { test, expect, buildBooking, API_CREDENTIALS } from '../fixtures/api.fixtures';

/**
 * Booking Lifecycle E2E
 *
 * Tests the complete CRUD flow in a single test:
 *   Create → Read → Update (PUT) → Partial Update (PATCH) → Delete → Verify Gone
 */
test.describe('Booking Lifecycle — E2E', () => {

  test('complete CRUD lifecycle: create → read → update → patch → delete', async ({ bookingClient }) => {
    // ── Step 1: Get auth token ────────────────────────────────────────────────
    const token = await bookingClient.getToken(API_CREDENTIALS.username, API_CREDENTIALS.password);
    expect(token).toBeTruthy();

    // ── Step 2: Create booking ────────────────────────────────────────────────
    const createPayload = buildBooking({
      firstname:   'Lifecycle',
      lastname:    'Test',
      totalprice:  300,
      depositpaid: true,
    });

    const createResponse = await bookingClient.createBooking(createPayload);
    expect(createResponse.status()).toBe(200);

    const created   = await createResponse.json();
    const bookingId = created.bookingid;
    expect(bookingId).toBeDefined();
    expect(created.booking.firstname).toBe('Lifecycle');

    // ── Step 3: Read booking ──────────────────────────────────────────────────
    const readResponse = await bookingClient.getBookingById(bookingId);
    expect(readResponse.status()).toBe(200);

    const read = await readResponse.json();
    expect(read.firstname).toBe('Lifecycle');
    expect(read.lastname).toBe('Test');
    expect(read.totalprice).toBe(300);

    // ── Step 4: Full update (PUT) ─────────────────────────────────────────────
    const updatePayload = buildBooking({
      firstname:   'Updated',
      lastname:    'Lifecycle',
      totalprice:  500,
      depositpaid: false,
      bookingdates: {
        checkin:  '2025-07-01',
        checkout: '2025-07-14',
      },
    });

    const updateResponse = await bookingClient.updateBooking(bookingId, updatePayload, token);
    expect(updateResponse.status()).toBe(200);

    const updated = await updateResponse.json();
    expect(updated.firstname).toBe('Updated');
    expect(updated.totalprice).toBe(500);
    expect(updated.depositpaid).toBe(false);

    // ── Step 5: Partial update (PATCH) ────────────────────────────────────────
    const patchResponse = await bookingClient.partialUpdateBooking(
      bookingId,
      { additionalneeds: 'Late checkout', totalprice: 550 },
      token,
    );
    expect(patchResponse.status()).toBe(200);

    const patched = await patchResponse.json();
    expect(patched.additionalneeds).toBe('Late checkout');
    expect(patched.totalprice).toBe(550);
    expect(patched.firstname).toBe('Updated');  // unchanged from PUT

    // ── Step 6: Delete booking ────────────────────────────────────────────────
    const deleteResponse = await bookingClient.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    // ── Step 7: Verify gone ───────────────────────────────────────────────────
    const verifyResponse = await bookingClient.getBookingById(bookingId);
    expect(verifyResponse.status()).toBe(404);
  });

});
