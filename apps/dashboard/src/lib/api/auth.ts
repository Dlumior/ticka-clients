import { z } from 'zod'
import { zUserLoginOutput, zUserMeOutput, zUserRegisterOutput } from '@repo/api-types'
import { apiRequest, isAuthenticated as checkIsAuthenticated } from './client'
import type {
  zUserLoginInputRequest,
  zUserRegisterInputRequest,
} from '@repo/api-types'

const isBrowser = typeof window !== 'undefined'

export type LoginInput = z.infer<typeof zUserLoginInputRequest>
export type RegisterInput = z.infer<typeof zUserRegisterInputRequest>
export type User = z.infer<typeof zUserMeOutput>

export function isAuthenticated(): boolean {
  return checkIsAuthenticated()
}

export async function login(credentials: LoginInput): Promise<{ user: User }> {
  const data = await apiRequest(
    {
      method: 'POST',
      url: '/identities/auth/login/',
      data: credentials,
    },
    zUserLoginOutput,
  )
  return { user: data.user }
}

export async function register(
  userData: RegisterInput,
): Promise<{ user: User }> {
  const data = await apiRequest(
    {
      method: 'POST',
      url: '/identities/auth/register/',
      data: userData,
    },
    zUserRegisterOutput,
  )
  return { user: data.user }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest(
      {
        method: 'POST',
        url: '/identities/auth/logout/',
      },
      z.void(),
    )
  } catch {
  } finally {
    const cookiesToDelete = [
      'ticka_access_token',
      'ticka_refresh_token',
      'sessionid',
      'csrftoken',
    ]
    cookiesToDelete.forEach((cookie) => {
      document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })

    if (isBrowser) {
      window.location.href = '/signin'
    }
  }
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest(
    {
      method: 'GET',
      url: '/identities/auth/me/',
    },
    zUserMeOutput,
  )
}
