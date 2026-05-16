import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import {
  organizationDetailQueryOptions,
  organizationsQueryOptions,
} from '@/features/organizations/api/organizations.api'

export const Route = createFileRoute('/_authenticated/orgs/$orgSlug')({
  beforeLoad: async ({ context, params }) => {
    const organizations = await context.queryClient.ensureQueryData(
      organizationsQueryOptions,
    )
    const organization = organizations.find((o) => o.slug === params.orgSlug)
    if (!organization) throw notFound()

    const detail = await context.queryClient.ensureQueryData(
      organizationDetailQueryOptions(organization.id),
    )

    return { organization, organizationDetail: detail }
  },
  component: OrgLayout,
})

function OrgLayout() {
  return <Outlet />
}
