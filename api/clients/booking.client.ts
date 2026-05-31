import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.client';
import {
  AuthRequest,
  AuthResponse,
  Booking,
  BookingFilter,
  BookingId,
  BookingResponse,
  PartialBooking,
} from '../models/booking.model';

// ─────────────────────────────────────────────────────────────────────────────
//  BookingApiClient
//
//  Encapsulates all Restful-Booker API endpoints.
//  Each method returns the raw APIResponse so tests can assert on
//  both status codes and response bodies.
//
//  Endpoints:
//    POST   /auth                → create token
//    GET    /ping                → health check
//    GET    /booking             → list all booking IDs (optional filters)
//    GET    /booking/:id         → get single booking
//    POST   /booking             → create booking
//    PUT    /booking/:id         → full update  (token required)
//    PATCH  /booking/:id         → partial update (token required)
//    DELETE /booking/:id         → delete booking  (token required)
// ─────────────────────────────────────────────────────────────────────────────

export class BookingApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://restful-booker.herokuapp.com');
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  async createToken(credentials: AuthRequest): Promise<APIResponse> {
    return this.post('/auth', credentials);
  }

  /** Convenience: creates token and returns the token string directly */
  async getToken(username: string, password: string): Promise<string> {
    const response = await this.createToken({ username, password });
    const body: AuthResponse = await response.json();
    if (!body.token) {
      throw new Error(`Failed to get auth token. Response: ${JSON.stringify(body)}`);
    }
    return body.token;
  }

  // ── Health ──────────────────────────────────────────────────────────────────

  async ping(): Promise<APIResponse> {
    return this.get('/ping');
  }

  // ── Booking CRUD ─────────────────────────────────────────────────────────────

  async getAllBookings(filters?: BookingFilter): Promise<APIResponse> {
    const params = filters as Record<string, string> | undefined;
    return this.get('/booking', params);
  }

  async getBookingById(id: number): Promise<APIResponse> {
    return this.get(`/booking/${id}`);
  }

  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.post('/booking', booking);
  }

  async updateBooking(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.put(`/booking/${id}`, booking, token);
  }

  async partialUpdateBooking(id: number, booking: PartialBooking, token: string): Promise<APIResponse> {
    return this.patch(`/booking/${id}`, booking, token);
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.delete(`/booking/${id}`, token);
  }
}
