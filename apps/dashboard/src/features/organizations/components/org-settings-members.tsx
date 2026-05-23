import { useMemo, useState } from 'react'
import {
  RiDeleteBin6Line,
  RiMailSendLine,
  RiSearchLine,
  RiTeamLine,
  RiUserAddLine,
} from '@remixicon/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { IfCan, ORG_ROLE_BADGE_VARIANT, ORG_ROLE_LABEL, ORG_ROLES } from '@/features/permissions'
import type { OrgPermissions, OrgRole } from '@/features/permissions'
import { useAuth } from '@/features/auth/auth.context'
import { useWorkspaceMembers } from '@/features/members/api/members.api'
import type { OrganizationDetail } from '../api/organizations.api'
import { useOrgMembers, useRemoveOrgMember, useUpdateOrgMemberRole } from '../api/org-members.api'
import type { OrgMember } from '../api/org-members.api'
import { InviteOrgMemberDialog } from './invite-org-member-dialog'

interface OrgSettingsMembersProps {
  orgId: string
  orgDetail: OrganizationDetail
  perms: OrgPermissions
}

export function OrgSettingsMembers({ orgId, orgDetail, perms }: OrgSettingsMembersProps) {
  const [search, setSearch] = useState('')
  const [workspaceFilter, setWorkspaceFilter] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)

  const { data: members, isLoading } = useOrgMembers(orgId)
  const { data: wsMembers } = useWorkspaceMembers(workspaceFilter ?? '')

  const filteredMembers = useMemo(() => {
    let list = members ?? []

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) =>
          m.user.full_name.toLowerCase().includes(q) ||
          m.user.email.toLowerCase().includes(q),
      )
    }

    if (workspaceFilter && wsMembers) {
      const wsUserIds = new Set(wsMembers.map((wm) => wm.user_id))
      list = list.filter((m) => wsUserIds.has(m.user.id))
    }

    return list
  }, [members, search, workspaceFilter, wsMembers])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <RiSearchLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={workspaceFilter ?? 'all'}
          onValueChange={(v) => setWorkspaceFilter(v === 'all' ? null : v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All workspaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All workspaces</SelectItem>
            {orgDetail.workspaces.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <IfCan condition={perms.canManageMembers}>
          <InviteOrgMemberDialog
            orgId={orgId}
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            trigger={
              <Button size="sm">
                <RiUserAddLine className="size-4" />
                Invite member
              </Button>
            }
          />
        </IfCan>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="flex flex-col divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden">
          {filteredMembers.map((member) => (
            <OrgMemberRow
              key={member.id}
              member={member}
              orgId={orgId}
              perms={perms}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          search={search}
          hasMembers={(members?.length ?? 0) > 0}
          perms={perms}
          orgId={orgId}
        />
      )}
    </div>
  )
}

function OrgMemberRow({
  member,
  orgId,
  perms,
}: {
  member: OrgMember
  orgId: string
  perms: OrgPermissions
}) {
  const { user: currentUser } = useAuth()
  const [pendingRemove, setPendingRemove] = useState(false)
  const updateRole = useUpdateOrgMemberRole(orgId)
  const removeOrgMember = useRemoveOrgMember(orgId)

  const isSelf = currentUser?.id === member.user.id
  const role = (member.role ?? 'viewer') as OrgRole
  const initials = (
    [member.user.first_name?.[0], member.user.last_name?.[0]]
      .filter(Boolean)
      .join('') || member.user.email[0]
  ).toUpperCase()
  const fullName = [member.user.first_name, member.user.last_name]
    .filter(Boolean)
    .join(' ')

  function handleRoleChange(newRole: OrgRole) {
    if (newRole === role) return
    updateRole.mutate({ memberId: member.id, role: newRole })
  }

  function handleRemoveConfirm() {
    removeOrgMember.mutate(member.id)
    setPendingRemove(false)
  }

  return (
    <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
      <Avatar className="size-9 shrink-0 rounded-lg">
        <AvatarFallback className="rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-none">
          {fullName || member.user.email}
        </p>
        {fullName && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {member.user.email}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {perms.canManageMembers && !isSelf ? (
          <Select
            value={role}
            onValueChange={(v) => handleRoleChange(v as OrgRole)}
            disabled={updateRole.isPending}
          >
            <SelectTrigger className="h-7 w-28 text-xs px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORG_ROLES.filter((r) => r !== 'owner').map((r) => (
                <SelectItem key={r} value={r} className="text-xs">
                  {ORG_ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge
            variant={ORG_ROLE_BADGE_VARIANT[role]}
            className="text-[10px] shrink-0"
          >
            {ORG_ROLE_LABEL[role]}
          </Badge>
        )}

        {perms.canManageMembers && !isSelf && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {pendingRemove ? (
              <>
                <span className="text-xs text-muted-foreground">Remove?</span>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 px-2 text-xs"
                  onClick={handleRemoveConfirm}
                  disabled={removeOrgMember.isPending}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => setPendingRemove(false)}
                >
                  No
                </Button>
              </>
            ) : (
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setPendingRemove(true)}
                aria-label={`Remove ${fullName || member.user.email}`}
              >
                <RiDeleteBin6Line className="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  search,
  hasMembers,
  perms,
  orgId,
}: {
  search: string
  hasMembers: boolean
  perms: OrgPermissions
  orgId: string
}) {
  if (search || hasMembers) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/40">
          <RiSearchLine className="size-6" />
        </div>
        <p className="text-sm font-medium">No results</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search or workspace filter.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/40">
        <RiTeamLine className="size-6" />
      </div>
      <p className="text-sm font-medium">No members yet</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Invite people to collaborate in this organization.
      </p>
      {perms.canManageMembers && (
        <div className="mt-4">
          <InviteOrgMemberDialog
            orgId={orgId}
            trigger={
              <Button size="sm" variant="outline">
                <RiMailSendLine className="size-4" />
                Invite first member
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}
