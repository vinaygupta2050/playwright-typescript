import { test as base } from '@playwright/test';
import { BookingApiClient } from '../clients/booking.client';
import { Booking } from '../models/booking.model';

// ── API credentials (restful-booker default) ──────────────────────────────────
export const API_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
} as const;

// ── Reusable booking payload factory ─────────────────────────────────────────
export const buildBooking = (overrides: Partial<Booking> = {}): Booking => ({
  firstname:       'John',
  lastname:        'Doe',
  totalprice:      150,
  depositpaid:     true,
  bookingdates: {
    checkin:  '2025-01-01',
    checkout: '2025-01-07',
  },
  additionalneeds: 'Breakfast',
  ...overrides,
});

// ── Fixture types ─────────────────────────────────────────────────────────────
type ApiFixtures = {
  bookingClient: BookingApiClient;
  authToken: string;
  createdBookingId: number;
};

// ── Extended test with API fixtures ──────────────────────────────────────────
export const test = base.extend<ApiFixtures>({

  /** Injects a ready-to-use BookingApiClient */
  bookingClient: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },

  /** Injects a valid auth token — fetched once per test */
  authToken: async ({ request }, use) => {
    const client = new BookingApiClient(request);
    const token  = await client.getToken(API_CREDENTIALS.username, API_CREDENTIALS.password);
    await use(token);
  },

  /**
   * Creates a booking before the test, yields its ID,
   * then cleans it up after the test automatically.
   */
  createdBookingId: async ({ request, authToken }, use) => {
    const client   = new BookingApiClient(request);
    const response = await client.createBooking(buildBooking());
    const body     = await response.json();
    const id: number = body.bookingid;

    await use(id);

    // teardown — delete the booking after the test
    await client.deleteBooking(id, authToken).catch(() => {
      // ignore if already deleted by the test itself
    });
  },
});

export { expect } from '@playwright/test';
