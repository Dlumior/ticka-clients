import { useState } from "react"
import { useTranslation } from "react-i18next"
import { RiTeamLine, RiMailSendLine, RiUserAddLine } from "@remixicon/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MemberCard } from "./member-card"
import { InvitationCard } from "./invitation-card"
import { InviteMemberDialog } from "./invite-member-dialog"
import {
  useWorkspaceMembers,
  useOrgInvitations,
  useWorkspaceMembership,
} from "../api/members.api"
import {
  useWorkspacePermissions,
  asOrgRole,
  asWorkspaceRole,
} from "@/features/permissions"

interface WorkspaceMembersListProps {
  workspaceId: string
  orgId: string
  orgRole: string
  timezone: string
}

export function WorkspaceMembersList({
  workspaceId,
  orgId,
  orgRole,
  timezone,
}: WorkspaceMembersListProps) {
  const { t } = useTranslation("members")
  const [inviteOpen, setInviteOpen] = useState(false)
  const { data: members, isLoading: membersLoading } =
    useWorkspaceMembers(workspaceId)
  const { data: allInvitations, isLoading: invitesLoading } =
    useOrgInvitations(orgId)

  const invitations =
    allInvitations?.filter((inv) => inv.workspace === workspaceId) ?? []
  const { data: membership } = useWorkspaceMembership(workspaceId)
  const wsRole = asWorkspaceRole(membership?.workspace_role ?? "") ?? "viewer"
  const { canInvite } = useWorkspacePermissions(wsRole, asOrgRole(orgRole))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        {canInvite && (
          <InviteMemberDialog
            workspaceId={workspaceId}
            orgId={orgId}
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            trigger={
              <Button size="sm">
                <RiUserAddLine className="size-4" />
                {t("inviteMember")}
              </Button>
            }
          />
        )}
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members" className="gap-1.5">
            {t("members")}
            {members && members.length > 0 && (
              <Badge
                variant="secondary"
                className="h-4 px-1.5 py-0 text-[10px]"
              >
                {members.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-1.5">
            {t("invitations")}
            {invitations.length > 0 && (
              <Badge
                variant="secondary"
                className="h-4 px-1.5 py-0 text-[10px]"
              >
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          {membersLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-22 rounded-xl" />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <MemberCard key={m.id} member={m} timezone={timezone} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<RiTeamLine className="size-6" />}
              title={t("noMembers")}
              description={t("noMembersDesc")}
            />
          )}
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          {invitesLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-22 rounded-xl" />
              ))}
            </div>
          ) : invitations.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.map((inv) => (
                <InvitationCard
                  key={inv.id}
                  invitation={inv}
                  workspaceId={workspaceId}
                  orgId={orgId}
                  canResend={canInvite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<RiMailSendLine className="size-6" />}
              title={t("noInvitations")}
              description={t("noInvitationsDesc")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground ring-1 ring-border/40">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
