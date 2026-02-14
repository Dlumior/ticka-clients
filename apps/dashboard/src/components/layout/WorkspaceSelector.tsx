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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspace } from '@/hooks/useWorkspace'

export function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, isLoading } =
    useWorkspace()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/50 w-full">
        <div className="h-5 w-5 rounded bg-muted animate-pulse" />
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-between px-2 hover:bg-muted"
          />
        }
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
            {currentWorkspace ? (
              <span className="text-xs font-medium text-primary">
                {currentWorkspace.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <IconBuilding className="h-3.5 w-3.5 text-primary" />
            )}
          </div>

          <span className="truncate text-sm font-medium">
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
        </div>

        <IconChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-primary">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <span className="flex-1 truncate">{workspace.name}</span>

                {currentWorkspace?.id === workspace.id && (
                  <IconCheck className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <IconPlus className="h-4 w-4 mr-2" />
            Create new workspace
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
