import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OrganizationProvider } from '@/hooks/useOrganization'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    <OrganizationProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </OrganizationProvider>
  )
}
