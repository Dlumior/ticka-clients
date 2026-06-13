import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'
import { InvoicesTable } from '@/features/invoices/components/invoices-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/invoices',
)({
  component: InvoicesPage,
})

function InvoicesPage() {
  const { workspace, organizationDetail } = Route.useRouteContext()
  const { t } = useTranslation('invoices')

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('page.subtitle')}
        </p>
      </div>

      <InvoicesTable
        workspaceId={workspace.id}
        timezone={organizationDetail.timezone}
      />
    </div>
  )
}
