import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
    _skipAuthRefresh?: boolean
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Endpoints whose 401 must NOT trigger a refresh attempt: the refresh call itself
// (avoids infinite recursion when the refresh cookie is also expired) and the
// login/logout calls (no point refreshing when the user is explicitly
// authenticating or signing out).
const AUTH_NO_REFRESH_URLS = [
  '/api/v1/identities/auth/login/',
  '/api/v1/identities/auth/refresh/',
  '/api/v1/identities/auth/logout/',
]

function shouldAttemptRefresh(error: AxiosError): boolean {
  if (error.response?.status !== 401) return false
  const config = error.config
  if (!config) return false
  if (config._retry || config._skipAuthRefresh) return false
  const url = config.url ?? ''
  return !AUTH_NO_REFRESH_URLS.some((authUrl) => url.includes(authUrl))
}

// Single in-flight refresh promise so a burst of concurrent 401s collapses to
// one POST /auth/refresh/ call.
let refreshPromise: Promise<void> | null = null

function performRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/api/v1/identities/auth/refresh/', null, {
        _skipAuthRefresh: true,
      })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

function wrapError(error: AxiosError): Error {
  const data = error.response?.data as
    | { message?: string; detail?: string }
    | undefined
  const message =
    data?.message ??
    data?.detail ??
    error.message ??
    'An unexpected error occurred'
  const wrapped = new Error(message) as Error & { status?: number }
  wrapped.status = error.response?.status
  return wrapped
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (shouldAttemptRefresh(error)) {
      try {
        await performRefresh()
      } catch {
        return Promise.reject(wrapError(error))
      }
      const config = error.config as InternalAxiosRequestConfig
      config._retry = true
      return apiClient.request(config)
    }
    return Promise.reject(wrapError(error))
  },
)
