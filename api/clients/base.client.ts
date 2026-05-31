import { APIRequestContext, APIResponse } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
//  BaseApiClient
//
//  Thin wrapper around Playwright's APIRequestContext.
//  Provides typed GET / POST / PUT / PATCH / DELETE helpers and
//  centralises header management (Content-Type, Accept, auth token).
// ─────────────────────────────────────────────────────────────────────────────

export class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl  = baseUrl;
  }

  // ── Default headers ─────────────────────────────────────────────────────────

  protected defaultHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    };
    if (token) {
      headers['Cookie'] = `token=${token}`;
    }
    return headers;
  }

  // ── HTTP helpers ─────────────────────────────────────────────────────────────

  protected async get(
    path: string,
    params?: Record<string, string>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders(token),
      params,
    });
  }

  protected async post(
    path: string,
    body: unknown,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders(token),
      data:    body,
    });
  }

  protected async put(
    path: string,
    body: unknown,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders(token),
      data:    body,
    });
  }

  protected async patch(
    path: string,
    body: unknown,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders(token),
      data:    body,
    });
  }

  protected async delete(
    path: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders(token),
    });
  }
}
