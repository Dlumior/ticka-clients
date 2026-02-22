import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$organizationId')({
  component: OrganizationLayout,
  beforeLoad: ({ params }) => ({
    breadcrumb: 'Organization',
    organizationId: params.organizationId,
  }),
})

function OrganizationLayout() {
  return <Outlet />
}
