import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { zUserMeOutput } from '@repo/api-types'
import type { z } from 'zod'
import { currentUserQueryOptions } from '@/features/auth/api/auth.api'

type UserMe = z.infer<typeof zUserMeOutput>

export interface AuthContext {
  isAuthenticated: boolean
  user: UserMe | null | undefined
}

const AuthContext = React.createContext<AuthContext | null>(null)

function readUser(queryClient: QueryClient) {
  return queryClient.getQueryData<UserMe | null>(
    currentUserQueryOptions.queryKey,
  )
}

function isAuthMeKey(key: ReadonlyArray<unknown>) {
  return key[0] === 'auth' && key[1] === 'me'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = React.useState<UserMe | null | undefined>(() =>
    readUser(queryClient),
  )

  React.useEffect(() => {
    // Catch any cache update that happened between initial render and the
    // effect attaching its subscription.
    setUser(readUser(queryClient))

    // Read the user from the cache directly instead of via useQuery. A
    // useQuery observer would be torn down during React StrictMode's
    // double-mount cleanup, and that teardown cancels the in-flight /me
    // request — rejecting the route guard's awaiter with a CancelledError.
    // Subscribing at the cache layer reacts to login/logout/setQueryData
    // without owning the query's lifecycle.
    return queryClient.getQueryCache().subscribe((event) => {
      if (isAuthMeKey(event.query.queryKey)) {
        setUser(readUser(queryClient))
      }
    })
  }, [queryClient])

  const value = React.useMemo<AuthContext>(
    () => ({ isAuthenticated: !!user, user }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContext {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
