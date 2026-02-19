import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { z } from 'zod'

const API_BASE_URL =
  import.meta.env.VITE_TICKA_SERVER_API_BASE_URL ||
  'http://localhost:8000/api/v1'
const AUTH_TOKEN_KEY = 'ticka_auth_token'

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

export class ValidationError extends Error {
  constructor(
    public issues: Array<z.ZodIssue>,
    message = 'Response validation failed',
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; detail?: string }>) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data.message || data.detail || `HTTP ${status}`
      throw new ApiError(status, data, message)
    }
    throw error
  },
)

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean
}

export async function apiRequest<T extends z.ZodType>(
  config: RequestOptions,
  schema: T,
): Promise<z.infer<T>> {
  const { skipAuth, ...axiosConfig } = config

  if (skipAuth) {
    const response = await api.request({
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        Authorization: undefined,
      },
    })
    return parseResponse(response.data, schema)
  }

  const response = await api.request(axiosConfig)
  return parseResponse(response.data, schema)
}

function parseResponse<T extends z.ZodType>(data: unknown, schema: T): z.infer<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ValidationError(result.error.issues)
  }
  return result.data
}

export default api
