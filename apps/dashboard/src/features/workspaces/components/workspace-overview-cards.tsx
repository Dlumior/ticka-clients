import {
  RiCheckLine,
  RiFileCopyLine,
  RiInboxLine,
  RiInformationLine,
  RiTeamLine,
} from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Workspace } from '@/features/organizations/api/organizations.api'
import { useClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'
import { asWorkspaceRole, WORKSPACE_ROLE_BADGE_VARIANT } from '@/features/permissions'
import { useWorkspaceMembership, useWorkspaceMembers } from '@/features/members/api/members.api'

interface WorkspaceOverviewCardsProps {
  workspace: Workspace
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function WorkspaceOverviewCards({
  workspace,
}: WorkspaceOverviewCardsProps) {
  const { copied, copy } = useClipboard()

  const { data: membership } = useWorkspaceMembership(workspace.id)
  const wsRole = membership?.workspace_role ? asWorkspaceRole(membership.workspace_role) : undefined
  const wsRoleVariant = wsRole ? WORKSPACE_ROLE_BADGE_VARIANT[wsRole] : 'outline'

  const { data: members } = useWorkspaceMembers(workspace.id)
  const memberCount = members?.length ?? 0

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Workspace identity + inbox email — spans 2 cols */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RiInboxLine className="size-3.5 shrink-0" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Workspace
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">{workspace.name}</CardTitle>
            <Badge
              variant={workspace.is_active ? 'default' : 'secondary'}
              className="translate-y-px"
            >
              {workspace.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <CardDescription className="font-mono text-xs">
            /{workspace.slug}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Separator />

          {/* Inbox email — hero element */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Inbox Email
            </p>
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors duration-300',
                copied
                  ? 'border-primary/40 bg-primary/15'
                  : 'border-primary/20 bg-primary/10',
              )}
            >
              <RiInboxLine
                className={cn(
                  'size-4 shrink-0 transition-colors',
                  copied ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              <span
                className={cn(
                  'flex-1 truncate font-mono text-sm transition-colors',
                  copied ? 'text-primary' : 'text-foreground',
                )}
              >
                {workspace.inbox_email}
              </span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => copy(workspace.inbox_email)}
                      className={cn(
                        'shrink-0 transition-colors',
                        copied && 'text-primary hover:text-primary',
                      )}
                    />
                  }
                >
                  {copied ? (
                    <RiCheckLine className="size-4" />
                  ) : (
                    <RiFileCopyLine className="size-4" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
              <RiInformationLine className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Forward your vendor invoices and receipts to this address. Ticka
                will automatically extract the details and create tickets in this
                workspace.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members & access */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RiTeamLine className="size-3.5 shrink-0" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Team
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <p className="text-5xl font-bold tabular-nums leading-none">
              {memberCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {memberCount === 1 ? 'Member' : 'Members'} in workspace
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your role</span>
              {wsRole ? (
                <Badge variant={wsRoleVariant}>{capitalize(wsRole)}</Badge>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
