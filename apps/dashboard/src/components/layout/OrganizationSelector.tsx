import {
  IconBuilding,
  IconCheck,
  IconChevronDown,
  IconPlus,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOrganization } from '@/hooks/useOrganization'

function OrganizationAvatar({ name }: { name: string }) {
  return (
    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-primary">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

function WorkspaceAvatar({ name }: { name: string }) {
  return (
    <div className="h-5 w-5 rounded bg-muted flex items-center justify-center shrink-0">
      <span className="text-[10px] font-medium text-muted-foreground">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export function OrganizationSelector() {
  const {
    organizations,
    workspacesByOrg,
    currentOrganization,
    currentWorkspace,
    setCurrentOrganization,
    setCurrentWorkspace,
    isLoading,
  } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-0.5 px-2 py-1.5 rounded-md bg-muted/50 w-full">
        <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-between px-2 hover:bg-muted h-auto py-1.5"
          />
        }
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {currentOrganization ? (
            <OrganizationAvatar name={currentOrganization.name} />
          ) : (
            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">
              <IconBuilding className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate text-sm font-medium leading-tight">
              {currentOrganization?.name || 'Select Organization'}
            </span>
            {currentWorkspace && (
              <span className="truncate text-xs text-muted-foreground leading-tight">
                {currentWorkspace.name}
              </span>
            )}
          </div>
        </div>

        <IconChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {organizations
            .filter((org) => org.is_active)
            .map((org) => {
              const workspaces = workspacesByOrg[org.id] ?? []
              const isActiveOrg = currentOrganization?.id === org.id
              const hasWorkspaces = workspaces.some((ws) => ws.is_active)

              if (!hasWorkspaces) {
                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => setCurrentOrganization(org)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <OrganizationAvatar name={org.name} />
                      <span className="flex-1 truncate">{org.name}</span>
                      {isActiveOrg && (
                        <IconCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  </DropdownMenuItem>
                )
              }

              return (
                <DropdownMenuSub key={org.id}>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      <OrganizationAvatar name={org.name} />
                      <span className="flex-1 truncate">{org.name}</span>
                      {isActiveOrg && (
                        <IconCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                  </DropdownMenuSubTrigger>

                  <DropdownMenuSubContent className="w-48">
                    <DropdownMenuLabel className="text-xs">
                      {org.name} Workspaces
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {workspaces
                      .filter((ws) => ws.is_active)
                      .map((workspace) => {
                        const isActiveWorkspace = currentWorkspace?.id === workspace.id

                        return (
                          <DropdownMenuItem
                            key={workspace.id}
                            onClick={() =>
                              setCurrentWorkspace({
                                ...workspace,
                                organizationId: org.id,
                              })
                            }
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <WorkspaceAvatar name={workspace.name} />
                              <span className="flex-1 truncate">{workspace.name}</span>
                              {isActiveWorkspace && (
                                <IconCheck className="h-4 w-4 text-primary shrink-0" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )
            })}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <IconPlus className="h-4 w-4 mr-2" />
            Create organization
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
