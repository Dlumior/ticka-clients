import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { zUserLoginOutput, zUserMeOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { LoginFormValues } from './auth.schema'

type UserMe = z.infer<typeof zUserMeOutput>
type LoginOutput = z.infer<typeof zUserLoginOutput>

export const currentUserQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: ({ signal }) =>
    apiClient.get<UserMe>('/api/v1/identities/auth/me/', { signal }).then((r) => r.data),
  retry: false,
  staleTime: 5 * 60 * 1000,
})

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions)
}

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

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => apiClient.post('/api/v1/identities/auth/logout/').then((r) => r.data),
    onSuccess: () => {
      queryClient.clear()
      router.invalidate()
    },
  })
}
