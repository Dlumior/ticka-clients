import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getCurrentUser, login, logout, register } from '@/lib/api/auth'

const AUTH_QUERY_KEY = ['auth', 'user'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
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
      queryClient.clear()
      navigate({ to: '/signin' })
    },
    onError: () => {
      queryClient.clear()
      navigate({ to: '/signin' })
    },
  })
}

export function useIsAuthenticated(): boolean {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return true
  }

  return !!user
}
