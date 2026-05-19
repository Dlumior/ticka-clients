import type { VariantProps } from 'class-variance-authority'
import type { OrgInvitation } from '../api/members.api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>
type Status = 'pending' | 'accepted' | 'declined' | 'expired'

const STATUS_VARIANT: Record<Status, BadgeVariant> = {
  pending:  'outline',
  accepted: 'default',
  declined: 'destructive',
  expired:  'secondary',
}

const STATUS_LABEL: Record<Status, string> = {
  pending:  'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired:  'Expired',
}

export function InvitationCard({ invitation }: { invitation: OrgInvitation }) {
  const initial = invitation.email[0].toUpperCase()
  const role = String(invitation.workspace_role ?? invitation.role ?? 'member')
  const status = (invitation.status as Status) ?? 'pending'

  return (
    <Card size="sm" className="ring-1 ring-border/40">
      <CardContent className="flex items-start gap-3 p-4">
        <Avatar className="size-9 shrink-0 rounded-lg">
          <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium leading-none">{invitation.email}</p>
            <Badge variant={STATUS_VARIANT[status]} className="shrink-0 text-[10px]">
              {STATUS_LABEL[status]}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{role}</p>
          <p className="mt-2 text-[11px] text-muted-foreground/70">
            Invited by {invitation.invited_by_email}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
