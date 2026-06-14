import { useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { zUserLoginOutput, zUserMeOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { LoginFormValues, RegisterFormValues } from './auth.schema'

type UserMe = z.infer<typeof zUserMeOutput>
type LoginOutput = z.infer<typeof zUserLoginOutput>

export const currentUserQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: ({ signal }): Promise<UserMe | null> =>
    apiClient
      .get<UserMe>('/api/v1/identities/auth/me/', { signal })
      .then((r) => zUserMeOutput.parse(r.data)),
  retry: false,
  staleTime: 5 * 60 * 1000,
})

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (credentials: LoginFormValues) =>
      apiClient
        .post<LoginOutput>('/api/v1/identities/auth/login/', credentials)
        .then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(currentUserQueryOptions.queryKey, data.user)
      router.invalidate()
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterFormValues) =>
      apiClient
        .post<{ user: UserMe }>('/api/v1/identities/auth/register/', data)
        .then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(currentUserQueryOptions.queryKey, data.user)
    },
  })
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) =>
      apiClient
        .post('/api/v1/identities/invitations/accept/', { token })
        .then((r) => r.data),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => apiClient.post('/api/v1/identities/auth/logout/').then((r) => r.data),
    onSuccess: () => {
      // Mark the user cache as cleared FIRST so the next navigation's auth
      // guard sees "no user" without firing a fresh /me (which would 401 and
      // pointlessly hit /auth/refresh/ before redirecting).
      queryClient.setQueryData(currentUserQueryOptions.queryKey, null)
      router.navigate({ to: '/login' })
      // Drop the rest of the cache last; safe because we already navigated.
      queryClient.clear()
    },
  })
}
