import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WorkspaceProvider } from '@/hooks/useWorkspace'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    <WorkspaceProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </WorkspaceProvider>
  )
}
