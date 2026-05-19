import type { WorkspaceMember } from '../api/members.api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { WORKSPACE_ROLE_BADGE_VARIANT, WORKSPACE_ROLE_LABEL } from '@/features/permissions'
import type { WorkspaceRole } from '@/features/permissions'

function getInitials(first: string, last: string, email: string) {
  return ([first[0], last[0]].filter(Boolean).join('') || email[0]).toUpperCase()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function MemberCard({ member }: { member: WorkspaceMember }) {
  const initials = getInitials(member.user_first_name, member.user_last_name, member.user_email)
  const fullName = [member.user_first_name, member.user_last_name].filter(Boolean).join(' ')
  const role = member.role as WorkspaceRole

  return (
    <Card size="sm" className="ring-1 ring-border/40">
      <CardContent className="flex items-start gap-3 p-4">
        <Avatar className="size-9 shrink-0 rounded-lg">
          <AvatarFallback className="rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium leading-none">
              {fullName || member.user_email}
            </p>
            <Badge variant={WORKSPACE_ROLE_BADGE_VARIANT[role]} className="shrink-0 text-[10px]">
              {WORKSPACE_ROLE_LABEL[role]}
            </Badge>
          </div>
          {fullName && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{member.user_email}</p>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground/70">
            Joined {formatDate(member.joined_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
