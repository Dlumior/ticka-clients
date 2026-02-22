import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useOrganization } from '@/hooks/useOrganization'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardRedirect,
})

function DashboardRedirect() {
  const { organizations, isLoading } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const firstOrg = organizations.find((o) => o.is_active)

  if (!firstOrg) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold">No Organizations</h2>
          <p className="text-muted-foreground mt-2">Create an organization to get started.</p>
        </div>
      </div>
    )
  }

  return <Navigate to="/dashboard/$organizationId" params={{ organizationId: firstOrg.id }} />
}
