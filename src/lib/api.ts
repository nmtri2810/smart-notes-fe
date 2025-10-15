// src/lib/api.ts
/**
 * A minimal API wrapper for the Smart Notes app.
 * Handles base URL, timeouts, JSON parsing, and errors gracefully.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const DEFAULT_TIMEOUT = 15000

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    })

    clearTimeout(id)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new ApiError(`Request failed (${res.status}): ${text}`, res.status)
    }

    const data = (await res.json().catch(() => ({}))) as T
    return data
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timeout', 408)
    }
    if (err instanceof Error) {
      throw new ApiError(err.message)
    }
    throw new ApiError('Unknown error occurred')
  }
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown,
  options: RequestInit = {},
) {
  return apiFetch<T>(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiGet<T = unknown>(path: string, options: RequestInit = {}) {
  return apiFetch<T>(path, { ...options, method: 'GET' })
}

export async function apiPut<T = unknown>(path: string, body?: unknown, options: RequestInit = {}) {
  return apiFetch<T>(path, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete<T = unknown>(path: string, options: RequestInit = {}) {
  return apiFetch<T>(path, { ...options, method: 'DELETE' })
}
