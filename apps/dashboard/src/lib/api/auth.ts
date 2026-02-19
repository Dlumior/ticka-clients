import type { AuthResponse, LoginInput, RegisterInput, User } from './types'

const API_BASE_URL =
  import.meta.env.VITE_TICKA_SERVER_API_BASE_URL ||
  'http://localhost:8000/api/v1'
const AUTH_TOKEN_KEY = 'ticka_auth_token'

// Helper to check if we're in the browser
const isBrowser = typeof window !== 'undefined'

export function getAuthToken(): string | null {
  if (!isBrowser) return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (!isBrowser) return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
  if (!isBrowser) return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  }

  const token = getAuthToken()
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Token ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || error.detail || `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export async function login(credentials: LoginInput): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/identities/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  })
  setAuthToken(data.token)
  return data
}

export async function register(userData: RegisterInput): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/identities/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  })
  setAuthToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  await apiClient<void>('/identities/auth/logout/', {
    method: 'POST',
  })
  removeAuthToken()
}

export async function getCurrentUser(): Promise<User> {
  return apiClient<User>('/identities/auth/me/')
}
