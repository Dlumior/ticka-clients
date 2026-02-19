import { Navigate, useLocation } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/useAuth'
import { isAuthenticated } from '@/lib/api/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const [isClient, setIsClient] = useState(false)

  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Quick check: if no token, redirect immediately
  if (!isAuthenticated()) {
    return <Navigate to="/signin" search={{ redirect: location.href }} />
  }

  // If we have a token, verify it with the query
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Token exists but user fetch failed = invalid token
  if (!user) {
    return <Navigate to="/signin" search={{ redirect: location.href }} />
  }

  return <>{children}</>
}
