import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useIsAuthenticated } from '@/hooks/useAuth'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return <Navigate to="/signin" />
}
