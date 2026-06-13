import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SuppliersTable } from '@/features/suppliers/components/suppliers-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/suppliers/',
)({
  component: SuppliersPage,
})

function SuppliersPage() {
  const { t } = useTranslation('suppliers')
  const { workspace } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('page.subtitle')}
        </p>
      </div>

      <SuppliersTable workspaceId={workspace.id} />
    </div>
  )
}
