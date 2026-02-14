import { Fragment } from 'react'
import { Link, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

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

  const breadcrumbs = matches
    .filter((match) => match.routeId !== '__root__')
    .map((match, index, array) => ({
      label: match.context?.breadcrumb || getBreadcrumbLabel(match.routeId),
      path: match.pathname,
      isLast: index === array.length - 1,
    }))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/dashboard" />}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.path}>
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
    '/dashboard/settings': 'Settings',
    '/dashboard/users': 'Users',
    '/dashboard/invoices': 'Invoices',
  }

  return labels[routeId] || routeId.split('/').pop() || 'Page'
}
