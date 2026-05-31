import { test, expect, buildBooking } from '../fixtures/api.fixtures';

test.describe('Get Booking API', () => {

  // ── GET /booking ─────────────────────────────────────────────────────────────

  test.describe('GET /booking — get all booking IDs', () => {

    test('should return 200 with an array of booking IDs', async ({ bookingClient }) => {
      const response = await bookingClient.getAllBookings();

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      // each item should have a bookingid
      body.forEach((item: { bookingid: number }) => {
        expect(item).toHaveProperty('bookingid');
        expect(typeof item.bookingid).toBe('number');
      });
    });

    test('should filter bookings by firstname', async ({ bookingClient, createdBookingId }) => {
      // createdBookingId creates a booking with firstname=John
      const response = await bookingClient.getAllBookings({ firstname: 'John' });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      // our created booking ID should appear in the results
      const ids = body.map((item: { bookingid: number }) => item.bookingid);
      expect(ids).toContain(createdBookingId);
    });

    test('should filter bookings by lastname', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.getAllBookings({ lastname: 'Doe' });

      expect(response.status()).toBe(200);

      const body = await response.json();
      const ids = body.map((item: { bookingid: number }) => item.bookingid);
      expect(ids).toContain(createdBookingId);
    });

    test('should filter bookings by firstname and lastname', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.getAllBookings({
        firstname: 'John',
        lastname:  'Doe',
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      const ids = body.map((item: { bookingid: number }) => item.bookingid);
      expect(ids).toContain(createdBookingId);
    });

    test('should return empty array for non-existent name', async ({ bookingClient }) => {
      const response = await bookingClient.getAllBookings({
        firstname: 'NonExistentName12345',
        lastname:  'NonExistentName12345',
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
    });

  });

  // ── GET /booking/:id ─────────────────────────────────────────────────────────

  test.describe('GET /booking/:id — get single booking', () => {

    test('should return 200 with full booking details', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.getBookingById(createdBookingId);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('firstname');
      expect(body).toHaveProperty('lastname');
      expect(body).toHaveProperty('totalprice');
      expect(body).toHaveProperty('depositpaid');
      expect(body).toHaveProperty('bookingdates');
      expect(body.bookingdates).toHaveProperty('checkin');
      expect(body.bookingdates).toHaveProperty('checkout');
    });

    test('should return correct booking data matching what was created', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.getBookingById(createdBookingId);
      const body     = await response.json();

      expect(body.firstname).toBe('John');
      expect(body.lastname).toBe('Doe');
      expect(body.totalprice).toBe(150);
      expect(body.depositpaid).toBe(true);
      expect(body.bookingdates.checkin).toBe('2025-01-01');
      expect(body.bookingdates.checkout).toBe('2025-01-07');
      expect(body.additionalneeds).toBe('Breakfast');
    });

    test('should return 404 for non-existent booking ID', async ({ bookingClient }) => {
      const response = await bookingClient.getBookingById(9999999);
      expect(response.status()).toBe(404);
    });

  });

});
