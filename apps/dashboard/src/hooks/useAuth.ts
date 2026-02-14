import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { getCurrentUser, isAuthenticated, login, logout, register } from '@/lib/api/auth'

const AUTH_QUERY_KEY = ['auth', 'user'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated(),
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user)
      navigate({ to: '/dashboard' })
    },
  })
}

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user)
      navigate({ to: '/dashboard' })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
      navigate({ to: '/signin' })
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
      navigate({ to: '/signin' })
    },
  })
}

export function useIsAuthenticated(): boolean {
  const { data: user, isLoading } = useCurrentUser()
  return isAuthenticated() && (!isLoading || !!user)
}
