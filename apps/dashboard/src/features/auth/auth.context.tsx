import * as React from 'react'
import { useCurrentUser } from '@/features/auth/api/auth.api'

export interface AuthContext {
  isAuthenticated: boolean
  user: ReturnType<typeof useCurrentUser>['data']
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser()

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
