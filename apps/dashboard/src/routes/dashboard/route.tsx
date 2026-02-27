import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { isAuthenticated } from '@/lib/api/client'
import { OrganizationProvider, orgKeys } from '@/lib/organizations'
import { listOrganizations } from '@/lib/api/organizations'

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/signin' })
    }

    const organizations = await context.queryClient.ensureQueryData({
      queryKey: orgKeys.all,
      queryFn: listOrganizations,
    })
    return { organizations }
  },
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    // Provider lives here so it's colocated with the route that loads its data
    <OrganizationProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </OrganizationProvider>
  )
}
