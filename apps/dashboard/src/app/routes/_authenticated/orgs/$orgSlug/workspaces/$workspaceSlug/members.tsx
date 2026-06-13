import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { WorkspaceMembersList } from '@/features/members/components/workspace-members-list'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/members',
)({
  component: MembersPage,
})

function MembersPage() {
  const { organization, organizationDetail, workspace } = Route.useRouteContext()
  const { t } = useTranslation('members')

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('members')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('manageAccess', { workspace: workspace.name })}
        </p>
      </div>

      <WorkspaceMembersList
        workspaceId={workspace.id}
        orgId={organization.id}
        orgRole={organization.user_role}
        timezone={organizationDetail.timezone}
      />
    </div>
  )
}
