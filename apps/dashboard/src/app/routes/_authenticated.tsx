import { createFileRoute, isRedirect, Outlet, redirect } from '@tanstack/react-router'
import axios from 'axios'
import { currentUserQueryOptions } from '@/features/auth/api/auth.api'
import { organizationsQueryOptions } from '@/features/organizations/api/organizations.api'
import { AppShell } from '@/components/layout/app-shell'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    try {
      await context.queryClient.ensureQueryData(currentUserQueryOptions)
    } catch (err) {
      // Router-initiated redirects must always propagate.
      if (isRedirect(err)) throw err
      // Aborted axios requests aren't auth failures — propagate as-is.
      if (axios.isCancel(err)) throw err
      // The axios interceptor attaches the response status onto the wrapped
      // Error. Only a real 401 (refresh also failed) means the user is
      // logged out; anything else (5xx, network) should surface via the
      // error boundary instead of being silently treated as a logout.
      if ((err as { status?: number }).status === 401) {
        throw redirect({ to: '/login', search: { redirect: location.href } })
      }
      throw err
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(organizationsQueryOptions),
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
