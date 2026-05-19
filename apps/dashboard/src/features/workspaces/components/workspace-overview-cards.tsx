import {
  RiBuildingLine,
  RiCheckLine,
  RiFileCopyLine,
  RiInboxLine,
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
import type {
  Organization,
  OrganizationDetail,
  Workspace,
} from '@/features/organizations/api/organizations.api'
import { useClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'
import { asOrgRole, asWorkspaceRole, ORG_ROLE_BADGE_VARIANT, WORKSPACE_ROLE_BADGE_VARIANT } from '@/features/permissions'
import { useWorkspaceMembership } from '@/features/members/api/members.api'

interface WorkspaceOverviewCardsProps {
  workspace: Workspace
  organization: Organization
  organizationDetail: OrganizationDetail
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function WorkspaceOverviewCards({
  workspace,
  organization,
  organizationDetail,
}: WorkspaceOverviewCardsProps) {
  const { copied, copy } = useClipboard()

  const orgRole = asOrgRole(organization.user_role)
  const roleVariant = orgRole ? ORG_ROLE_BADGE_VARIANT[orgRole] : 'outline'

  const { data: membership } = useWorkspaceMembership(workspace.id)
  const wsRole = membership?.workspace_role ? asWorkspaceRole(membership.workspace_role) : undefined
  const wsRoleVariant = wsRole ? WORKSPACE_ROLE_BADGE_VARIANT[wsRole] : 'outline'

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Workspace identity + inbox email — spans 2 cols on large screens */}
      <Card className="lg:col-span-2">
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
            <p className="text-xs text-muted-foreground">
              Forward emails to this address to create tickets in this
              workspace.
            </p>
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
              {organization.member_count}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {organization.member_count === 1 ? 'Member' : 'Members'}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Org role</span>
              <Badge variant={roleVariant}>
                {capitalize(organization.user_role)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Workspace role</span>
              {wsRole ? (
                <Badge variant={wsRoleVariant}>{capitalize(wsRole)}</Badge>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Workspaces</span>
              <span className="font-medium tabular-nums">
                {organization.workspace_count}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RiBuildingLine className="size-3.5 shrink-0" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Organization
            </span>
          </div>
          <CardTitle className="text-base">{organization.name}</CardTitle>
          <CardDescription>{capitalize(organization.type)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              {formatMonth(organization.created_at)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Workspaces</span>
            <span className="font-medium tabular-nums">
              {organizationDetail.workspaces.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium tabular-nums">
              {organization.member_count}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
