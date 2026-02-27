import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { Organization } from '@/lib/api/organizations'
import { orgKeys } from '@/lib/organizations'

export const Route = createFileRoute('/dashboard/$organizationId')({
  beforeLoad: ({ context, params }) => {
    const organizations =
      context.queryClient.getQueryData<Array<Organization>>(orgKeys.all) ?? []
    const org = organizations.find(
      (o) => o.id === params.organizationId && o.is_active,
    )

    if (!org) {
      // Org doesn't exist or is inactive — bounce to dashboard root
      // which will redirect to the first active org, or show NoOrganizations
      throw redirect({ to: '/dashboard' })
    }

    return {
      breadcrumb: org.name,
      organizationId: params.organizationId,
    }
  },
  component: OrganizationLayout,
})

function OrganizationLayout() {
  return <Outlet />
}
