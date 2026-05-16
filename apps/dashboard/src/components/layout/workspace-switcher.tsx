import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  RiAddLine,
  RiArrowUpDownLine,
  RiCheckLine,
  RiBriefcaseLine,
} from '@remixicon/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type {
  OrganizationDetail,
  Workspace,
} from '@/features/organizations/api/organizations.api'
import { CreateWorkspaceDialog } from '@/features/workspaces/components/create-workspace-dialog'

interface WorkspaceSwitcherProps {
  organization: OrganizationDetail
  workspace: Workspace | undefined
}

export function WorkspaceSwitcher({ organization, workspace }: WorkspaceSwitcherProps) {
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'
  const [createOpen, setCreateOpen] = useState(false)
  const canCreate = ['owner', 'admin'].includes(organization.user_role)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size={collapsed ? 'default' : 'lg'}
                tooltip={workspace?.name ?? organization.name}
                aria-label={
                  workspace
                    ? `Switch workspace (current: ${workspace.name})`
                    : 'Switch workspace'
                }
                className={cn(
                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                  collapsed && 'mx-auto flex justify-center',
                )}
              />
            }
          >
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30 ring-inset',
                collapsed ? 'size-7' : 'size-9',
              )}
            >
              <RiBriefcaseLine />
            </span>
            {!collapsed && (
              <>
                <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    {workspace?.name ?? 'Select workspace'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {organization.name}
                  </span>
                </span>
                <RiArrowUpDownLine className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side={collapsed ? 'right' : 'bottom'}
            sideOffset={6}
            className="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                {organization.name}
              </DropdownMenuLabel>
              {organization.workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  render={
                    <Link
                      to="/orgs/$orgSlug/workspaces/$workspaceSlug"
                      params={{
                        orgSlug: organization.slug,
                        workspaceSlug: ws.slug,
                      }}
                    />
                  }
                >
                  <RiBriefcaseLine className="size-4 text-muted-foreground" />
                  <span className="truncate">{ws.name}</span>
                  {ws.id === workspace?.id ? (
                    <RiCheckLine className="ml-auto size-4 text-primary" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {canCreate && <DropdownMenuSeparator />}
            {canCreate && (
              <DropdownMenuItem onClick={() => setTimeout(() => setCreateOpen(true), 0)}>
                <RiAddLine className="size-4" />
                <span>New workspace</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {canCreate && (
        <CreateWorkspaceDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          organizationId={organization.id}
          orgSlug={organization.slug}
        />
      )}
    </SidebarMenu>
  )
}
