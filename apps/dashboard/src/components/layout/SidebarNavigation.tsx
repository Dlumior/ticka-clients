import {
  IconFileInvoice,
  IconHome,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useOrganization } from '@/hooks/useOrganization'

const navigationItems = [
  {
    title: 'Home',
    icon: IconHome,
    path: '/dashboard',
    exact: true,
  },
  {
    title: 'Users',
    icon: IconUsers,
    path: '/dashboard/users',
    exact: false,
  },
  {
    title: 'Invoices',
    icon: IconFileInvoice,
    path: '/dashboard/invoices',
    exact: false,
  },
  {
    title: 'Configuration',
    icon: IconSettings,
    path: '/dashboard/settings',
    exact: false,
  },
]

export function SidebarNavigation() {
  const location = useLocation()
  const { currentWorkspace } = useOrganization()

  if (!currentWorkspace) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-muted-foreground">
              Select a workspace to view navigation
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navigationItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)

          return (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                render={<Link to={item.path} />}
                isActive={isActive}
                tooltip={item.title}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
