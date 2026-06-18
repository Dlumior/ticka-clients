import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import { BillingDocumentsTable } from '@/features/billing-documents/components/billing-documents-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/billing-documents',
)({
  component: BillingDocumentsPage,
})

function BillingDocumentsPage() {
  const { workspace, organizationDetail } = Route.useRouteContext()
  const { t } = useTranslation('billing-documents')

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('page.subtitle')}
        </p>
      </div>

      <BillingDocumentsTable
        workspaceId={workspace.id}
        timezone={organizationDetail.timezone}
      />
    </div>
  )
}
