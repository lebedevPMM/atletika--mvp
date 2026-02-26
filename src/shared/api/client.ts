import { ApiError } from './error';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  json?: unknown;
  searchParams?: Record<string, string | number | undefined>;
}

// Lazy imports to avoid circular deps - stores accessed at call time
function getAuthToken(): string | null {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAuthStore } = require('@/features/auth/store');
  return useAuthStore.getState().accessToken;
}

function getClubHeaders(): { clubId: string | null; branchId: string | null } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useClubStore } = require('@/features/club/store');
  const state = useClubStore.getState();
  return { clubId: state.clubId, branchId: state.branchId };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, searchParams, ...fetchOptions } = options;

  // Build URL
  const url = new URL(path, BASE_URL);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  // Headers
  const headers = new Headers(fetchOptions.headers);
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const { clubId, branchId } = getClubHeaders();
  if (clubId) headers.set('X-Club-Id', clubId);
  if (branchId) headers.set('X-Branch-Id', branchId);
  if (json) headers.set('Content-Type', 'application/json');

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
    body: json ? JSON.stringify(json) : undefined,
  });

  // 401 -> logout (no refresh in demo mode)
  if (response.status === 401) {
    const { useAuthStore } = require('@/features/auth/store');
    useAuthStore.getState().logout();
    throw new ApiError(401, 'UNAUTHORIZED', 'Сессия истекла');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.code || 'UNKNOWN',
      error.message || 'Ошибка сервера',
      error.details,
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json();
}

export const api = {
  get: <T>(path: string, searchParams?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: 'GET', searchParams }),
  post: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: 'POST', json }),
  put: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: 'PUT', json }),
  patch: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: 'PATCH', json }),
  delete: <T>(path: string, json?: unknown) =>
    request<T>(path, { method: 'DELETE', json }),
};
