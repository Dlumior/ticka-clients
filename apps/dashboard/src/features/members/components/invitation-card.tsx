import type { VariantProps } from 'class-variance-authority'
import type { OrgInvitation } from '../api/members.api'
import { useTranslation } from 'react-i18next'
import { RiMailSendLine, RiLoaderLine } from '@remixicon/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useResendWorkspaceInvitation } from '../api/members.api'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>
type Status = 'pending' | 'accepted' | 'declined' | 'expired'

const STATUS_VARIANT: Record<Status, BadgeVariant> = {
  pending:  'outline',
  accepted: 'default',
  declined: 'destructive',
  expired:  'secondary',
}

interface InvitationCardProps {
  invitation: OrgInvitation
  workspaceId: string
  orgId: string
  canResend: boolean
}

export function InvitationCard({ invitation, workspaceId, orgId, canResend }: InvitationCardProps) {
  const { t } = useTranslation('members')
  const initial = invitation.email[0].toUpperCase()
  const role = String(invitation.workspace_role ?? invitation.role ?? 'member')
  const status = (invitation.status as Status) ?? 'pending'
  const canShowResend = canResend && (status === 'pending' || status === 'expired')

  let expiryLabel = ''
  if (status !== 'accepted' && status !== 'declined') {
    const diffMs = new Date(invitation.expires_at).getTime() - Date.now()
    const absDays = Math.floor(Math.abs(diffMs) / 86_400_000)
    const absHours = Math.floor(Math.abs(diffMs) / 3_600_000)
    if (diffMs > 0) {
      if (absDays >= 1) expiryLabel = t('expiresInDays', { count: absDays })
      else if (absHours >= 1) expiryLabel = t('expiresInHours', { count: absHours })
      else expiryLabel = t('expiresSoon')
    } else {
      if (absDays >= 1) expiryLabel = t('expiredDaysAgo', { count: absDays })
      else if (absHours >= 1) expiryLabel = t('expiredHoursAgo', { count: absHours })
      else expiryLabel = t('justExpired')
    }
  }

  const { mutate: resend, isPending: isResending } = useResendWorkspaceInvitation(workspaceId, orgId)

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
              {t(`status.${status}`)}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{role}</p>
          {expiryLabel && (
            <p className="mt-1 text-[11px] text-muted-foreground/70">{expiryLabel}</p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground/70">
              {t('invitedBy', { email: invitation.invited_by_email })}
            </p>
            {canShowResend && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-[11px]"
                disabled={isResending}
                onClick={() => resend(invitation.id)}
              >
                {isResending ? (
                  <RiLoaderLine className="size-3 animate-spin" />
                ) : (
                  <RiMailSendLine className="size-3" />
                )}
                {t('resend')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
