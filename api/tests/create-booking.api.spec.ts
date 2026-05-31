import { test, expect, buildBooking } from '../fixtures/api.fixtures';

test.describe('Create Booking API', () => {

  test.describe('POST /booking — happy path', () => {

    test('should return 200 with bookingid and booking object', async ({ bookingClient, authToken }) => {
      const payload  = buildBooking();
      const response = await bookingClient.createBooking(payload);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('bookingid');
      expect(typeof body.bookingid).toBe('number');
      expect(body).toHaveProperty('booking');

      // cleanup
      await bookingClient.deleteBooking(body.bookingid, authToken);
    });

    test('should persist all fields correctly', async ({ bookingClient, authToken }) => {
      const payload  = buildBooking({
        firstname:       'Jane',
        lastname:        'Smith',
        totalprice:      250,
        depositpaid:     false,
        bookingdates: {
          checkin:  '2025-06-01',
          checkout: '2025-06-10',
        },
        additionalneeds: 'Lunch',
      });
      const response = await bookingClient.createBooking(payload);
      const body     = await response.json();

      expect(body.booking.firstname).toBe('Jane');
      expect(body.booking.lastname).toBe('Smith');
      expect(body.booking.totalprice).toBe(250);
      expect(body.booking.depositpaid).toBe(false);
      expect(body.booking.bookingdates.checkin).toBe('2025-06-01');
      expect(body.booking.bookingdates.checkout).toBe('2025-06-10');
      expect(body.booking.additionalneeds).toBe('Lunch');

      // cleanup
      await bookingClient.deleteBooking(body.bookingid, authToken);
    });

    test('should create booking without additionalneeds field', async ({ bookingClient, authToken }) => {
      const payload  = buildBooking();
      delete payload.additionalneeds;

      const response = await bookingClient.createBooking(payload);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.bookingid).toBeDefined();

      // cleanup
      await bookingClient.deleteBooking(body.bookingid, authToken);
    });

    test('should generate unique IDs for separate bookings', async ({ bookingClient, authToken }) => {
      const [r1, r2] = await Promise.all([
        bookingClient.createBooking(buildBooking()),
        bookingClient.createBooking(buildBooking()),
      ]);

      const b1 = await r1.json();
      const b2 = await r2.json();

      expect(b1.bookingid).not.toBe(b2.bookingid);

      // cleanup
      await Promise.all([
        bookingClient.deleteBooking(b1.bookingid, authToken),
        bookingClient.deleteBooking(b2.bookingid, authToken),
      ]);
    });

  });

  test.describe('POST /booking — validation', () => {

    test('should return 500 when required fields are missing', async ({ bookingClient }) => {
      const response = await bookingClient.createBooking({} as any);
      // restful-booker returns 500 for malformed body
      expect([400, 500]).toContain(response.status());
    });

  });

});
