import { test, expect, buildBooking } from '../fixtures/api.fixtures';

test.describe('Update Booking API', () => {

  // ── PUT /booking/:id — full update ───────────────────────────────────────────

  test.describe('PUT /booking/:id — full update', () => {

    test('should return 200 and updated booking', async ({ bookingClient, authToken, createdBookingId }) => {
      const updated  = buildBooking({
        firstname:   'UpdatedFirst',
        lastname:    'UpdatedLast',
        totalprice:  999,
        depositpaid: false,
        bookingdates: {
          checkin:  '2025-03-01',
          checkout: '2025-03-10',
        },
        additionalneeds: 'Dinner',
      });

      const response = await bookingClient.updateBooking(createdBookingId, updated, authToken);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe('UpdatedFirst');
      expect(body.lastname).toBe('UpdatedLast');
      expect(body.totalprice).toBe(999);
      expect(body.depositpaid).toBe(false);
      expect(body.bookingdates.checkin).toBe('2025-03-01');
      expect(body.bookingdates.checkout).toBe('2025-03-10');
      expect(body.additionalneeds).toBe('Dinner');
    });

    test('should persist full update when fetched by ID', async ({ bookingClient, authToken, createdBookingId }) => {
      const updated = buildBooking({ firstname: 'PersistTest', lastname: 'PersistLast' });
      await bookingClient.updateBooking(createdBookingId, updated, authToken);

      const fetchResponse = await bookingClient.getBookingById(createdBookingId);
      const body          = await fetchResponse.json();

      expect(body.firstname).toBe('PersistTest');
      expect(body.lastname).toBe('PersistLast');
    });

    test('should return 403 when no auth token is provided', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.updateBooking(
        createdBookingId,
        buildBooking(),
        'invalidtoken',
      );
      expect(response.status()).toBe(403);
    });

    test('should return 405 for non-existent booking ID', async ({ bookingClient, authToken }) => {
      const response = await bookingClient.updateBooking(9999999, buildBooking(), authToken);
      expect(response.status()).toBe(405);
    });

  });

  // ── PATCH /booking/:id — partial update ──────────────────────────────────────

  test.describe('PATCH /booking/:id — partial update', () => {

    test('should return 200 updating only firstname', async ({ bookingClient, authToken, createdBookingId }) => {
      const response = await bookingClient.partialUpdateBooking(
        createdBookingId,
        { firstname: 'PatchedFirst' },
        authToken,
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe('PatchedFirst');
      // other fields should remain unchanged
      expect(body.lastname).toBe('Doe');
    });

    test('should update only totalprice without touching other fields', async ({ bookingClient, authToken, createdBookingId }) => {
      const response = await bookingClient.partialUpdateBooking(
        createdBookingId,
        { totalprice: 500 },
        authToken,
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.totalprice).toBe(500);
      expect(body.firstname).toBe('John');     // unchanged
      expect(body.lastname).toBe('Doe');       // unchanged
      expect(body.depositpaid).toBe(true);     // unchanged
    });

    test('should update bookingdates partially', async ({ bookingClient, authToken, createdBookingId }) => {
      const response = await bookingClient.partialUpdateBooking(
        createdBookingId,
        {
          bookingdates: {
            checkin:  '2025-09-01',
            checkout: '2025-09-15',
          },
        },
        authToken,
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.bookingdates.checkin).toBe('2025-09-01');
      expect(body.bookingdates.checkout).toBe('2025-09-15');
    });

    test('should return 403 with invalid token', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.partialUpdateBooking(
        createdBookingId,
        { firstname: 'Hacker' },
        'badtoken',
      );
      expect(response.status()).toBe(403);
    });

  });

});
