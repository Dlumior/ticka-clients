import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { z } from 'zod'

const API_BASE_URL =
  import.meta.env.VITE_TICKA_SERVER_API_BASE_URL ||
  'http://localhost:8000/api/v1'

const isBrowser = typeof window !== 'undefined'

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

export function isAuthenticated(): boolean {
  if (!isBrowser) return false
  return true
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
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError<{ message?: string; detail?: string; error?: string }>,
  ) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh/') &&
      !originalRequest.url?.includes('/auth/login/') &&
      !originalRequest.url?.includes('/auth/register/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Token ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        await api.post('/identities/auth/refresh/')
        isRefreshing = false
        onTokenRefreshed('')
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        if (isBrowser) {
          window.location.href = '/signin'
        }
        return Promise.reject(refreshError)
      }
    }

    if (error.response) {
      const { status, data } = error.response
      const message =
        data.message || data.detail || data.error || `HTTP ${status}`
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
  const response = await api.request(config)
  return parseResponse(response.data, schema)
}

function parseResponse<T extends z.ZodType>(
  data: unknown,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ValidationError(result.error.issues)
  }
  return result.data
}

export default api
