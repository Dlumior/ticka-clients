import { Link, useLocation } from '@tanstack/react-router'
import type { NavItem } from './nav-config'
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { resolveRoute } from '@/lib/utils'

export function NavSubItem({
  label,
  icon: Icon,
  to,
  params,
  exact = false,
}: NavItem) {
  const location = useLocation()
  const resolved = resolveRoute(to, params)

  const isActive = exact
    ? location.pathname === resolved
    : location.pathname.startsWith(resolved)

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        render={<Link to={to} params={params} />}
        isActive={isActive}
      >
        <Icon className="size-4" />
        <span className="truncate">{label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}
