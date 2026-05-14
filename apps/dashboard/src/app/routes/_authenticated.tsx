import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { currentUserQueryOptions } from '@/features/auth/api/auth.api'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    try {
      await context.queryClient.fetchQuery(currentUserQueryOptions)
    } catch {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
