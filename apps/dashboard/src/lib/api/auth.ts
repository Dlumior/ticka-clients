import { z } from 'zod'
import {
  zUserLoginOutput,
  zUserMeOutput,
  zUserRegisterOutput,
} from '@repo/api-types'
import {
  apiRequest,
  isAuthenticated as checkIsAuthenticated,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from './client'
import type {
  zUserLoginInputRequest,
  zUserRegisterInputRequest,
} from '@repo/api-types'

export type LoginInput = z.infer<typeof zUserLoginInputRequest>
export type RegisterInput = z.infer<typeof zUserRegisterInputRequest>
export type User = z.infer<typeof zUser>
export type AuthResponse = z.infer<typeof zUserLoginOutput>

const zUser = zUserMeOutput

export { getAuthToken, removeAuthToken, setAuthToken }

export function isAuthenticated(): boolean {
  return checkIsAuthenticated()
}

export async function login(credentials: LoginInput): Promise<AuthResponse> {
  const data = await apiRequest(
    {
      method: 'POST',
      url: '/identities/auth/login/',
      data: credentials,
      skipAuth: true,
    },
    zUserLoginOutput,
  )
  setAuthToken(data.token)
  return data
}

export async function register(userData: RegisterInput): Promise<AuthResponse> {
  const data = await apiRequest(
    {
      method: 'POST',
      url: '/identities/auth/register/',
      data: userData,
      skipAuth: true,
    },
    zUserRegisterOutput,
  )
  setAuthToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  removeAuthToken()
  await apiRequest(
    {
      method: 'POST',
      url: '/identities/auth/logout/',
    },
    z.void(),
  )
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
