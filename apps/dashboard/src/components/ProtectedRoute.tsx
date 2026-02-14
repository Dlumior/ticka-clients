import { Navigate, useLocation } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { useCurrentUser, useIsAuthenticated } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = useIsAuthenticated()
  const { isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuth) {
    return (
      <Navigate
        to="/signin"
        search={{ redirect: location.href }}
      />
    )
  }

  return <>{children}</>
}
