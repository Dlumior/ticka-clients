import { Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayoutWrapper,
})

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
