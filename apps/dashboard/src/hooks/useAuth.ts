import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  getCurrentUser,
  isAuthenticated,
  login,
  logout,
  register,
} from '@/lib/api/auth'

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
      // Clear all queries first
      queryClient.clear()
      // Navigate to signin
      navigate({ to: '/signin' })
    },
    onError: () => {
      // Clear all queries even on error
      queryClient.clear()
      navigate({ to: '/signin' })
    },
  })
}

export function useIsAuthenticated(): boolean {
  // First check token-based auth
  if (!isAuthenticated()) {
    return false
  }

  const { data: user } = useCurrentUser()

  // If we have a token, we're authenticated
  // (the query will validate the token when it runs)
  return !!user
}
