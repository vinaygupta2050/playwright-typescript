// ─────────────────────────────────────────────────────────────────────────────
//  Restful-Booker API — TypeScript models
//  Base URL: https://restful-booker.herokuapp.com
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// ── Booking dates ─────────────────────────────────────────────────────────────

export interface BookingDates {
  checkin:  string;   // YYYY-MM-DD
  checkout: string;   // YYYY-MM-DD
}

// ── Booking ───────────────────────────────────────────────────────────────────

export interface Booking {
  firstname:       string;
  lastname:        string;
  totalprice:      number;
  depositpaid:     boolean;
  bookingdates:    BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking:   Booking;
}

export interface BookingId {
  bookingid: number;
}

// ── Partial update (PATCH) ────────────────────────────────────────────────────

export type PartialBooking = Partial<Booking>;

// ── Filter params for GET /booking ───────────────────────────────────────────

export interface BookingFilter {
  firstname?: string;
  lastname?:  string;
  checkin?:   string;
  checkout?:  string;
}
