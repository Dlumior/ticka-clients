import { Fragment } from 'react'
import { Link, useMatches, useParams } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useOrganization } from '@/hooks/useOrganization'

interface BreadcrumbMatch {
  routeId: string
  pathname: string
  params: Record<string, string>
  search: Record<string, unknown>
  loaderData?: unknown
  context?: {
    breadcrumb?: string
  }
}

export function AppBreadcrumbs() {
  const matches: Array<BreadcrumbMatch> = useMatches()
  const params = useParams({ strict: false })
  const { currentOrganization, currentWorkspace } = useOrganization()

  const organizationId = params.organizationId

  const breadcrumbs = matches
    .filter((match) => match.routeId !== '__root__')
    .map((match, index, array) => {
      let label = match.context?.breadcrumb || getBreadcrumbLabel(match.routeId)
      
      if (match.routeId.includes('$organizationId') && !match.routeId.includes('$workspaceId')) {
        if (label === 'Organization' && currentOrganization) {
          label = currentOrganization.name
        }
      }
      
      if (match.routeId.includes('$workspaceId')) {
        if (label === 'Workspace' && currentWorkspace) {
          label = currentWorkspace.name
        }
      }

      return {
        label,
        path: match.pathname,
        routeId: match.routeId,
        isLast: index === array.length - 1,
      }
    })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                to={
                  organizationId
                    ? '/dashboard/$organizationId'
                    : '/dashboard'
                }
                params={organizationId ? { organizationId } : undefined}
              />
            }
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.routeId}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link to={crumb.path} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function getBreadcrumbLabel(routeId: string): string {
  const labels: Record<string, string> = {
    '/dashboard/': 'Dashboard',
    '/dashboard/$organizationId': 'Organization',
    '/dashboard/$organizationId/': 'Home',
    '/dashboard/$organizationId/settings': 'Settings',
    '/dashboard/$organizationId/users': 'Users',
    '/dashboard/$organizationId/workspaces': 'Workspaces',
    '/dashboard/$organizationId/workspaces/$workspaceId': 'Workspace',
    '/dashboard/$organizationId/workspaces/$workspaceId/': 'Home',
    '/dashboard/$organizationId/workspaces/$workspaceId/settings': 'Settings',
    '/dashboard/$organizationId/workspaces/$workspaceId/users': 'Users',
    '/dashboard/$organizationId/workspaces/$workspaceId/invoices': 'Invoices',
  }

  return labels[routeId] || routeId.split('/').pop() || 'Page'
}
