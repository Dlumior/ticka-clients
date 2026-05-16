import { Link, useParams } from '@tanstack/react-router'
import { RiDashboardLine, RiLogoutBoxRLine } from '@remixicon/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useOrganizations, useOrganizationDetail } from '@/features/organizations/api/organizations.api'
import { useAuth } from '@/features/auth/auth.context'
import { useLogout } from '@/features/auth/api/auth.api'
import { WorkspaceSwitcher } from './workspace-switcher'

export function WorkspaceSidebar() {
  const params = useParams({ strict: false }) as {
    orgSlug?: string
    workspaceSlug?: string
  }
  const { data: organizations } = useOrganizations()
  const activeOrg = organizations?.find((o) => o.slug === params.orgSlug)
  const { data: orgDetail } = useOrganizationDetail(activeOrg?.id ?? '')

  if (!activeOrg || !orgDetail) {
    return (
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader>
          <Skeleton className="h-12 w-full rounded-md" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <Skeleton className="mt-2 h-8 w-full rounded-md" />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  const activeWorkspace = orgDetail.workspaces.find(
    (ws) => ws.slug === params.workspaceSlug,
  )

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border/60 group-data-[collapsible=icon]:px-0">
        <WorkspaceSwitcher organization={orgDetail} workspace={activeWorkspace} />
      </SidebarHeader>
      <SidebarContent className="px-1 pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-sidebar-foreground/50">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  tooltip="Overview"
                  render={
                    activeWorkspace
                      ? (
                          <Link
                            to="/orgs/$orgSlug/workspaces/$workspaceSlug"
                            params={{
                              orgSlug: orgDetail.slug,
                              workspaceSlug: activeWorkspace.slug,
                            }}
                            activeOptions={{ exact: true }}
                          />
                        )
                      : <span aria-disabled />
                  }
                >
                  <RiDashboardLine />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60">
        <SidebarUserFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

function SidebarUserFooter() {
  const { user } = useAuth()
  const logout = useLogout()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  const initials = (user?.full_name || user?.email || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?'

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-1 py-1',
        collapsed && 'flex-col gap-1 px-0',
      )}
    >
      <Avatar className="size-8 shrink-0 rounded-md">
        <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
          <span className="truncate font-medium text-sidebar-foreground">
            {user?.full_name || user?.email || 'You'}
          </span>
          {user?.email ? (
            <span className="truncate text-muted-foreground">{user.email}</span>
          ) : null}
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => logout.mutate()}
      >
        <RiLogoutBoxRLine />
      </Button>
    </div>
  )
}
