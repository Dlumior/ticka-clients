export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly errors: Record<string, string[]>

  constructor(
    message: string,
    code: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.errors = errors ?? {}
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}

export function getFieldError(err: unknown, field: string): string | undefined {
  return isApiError(err) ? err.errors[field]?.[0] : undefined
}
