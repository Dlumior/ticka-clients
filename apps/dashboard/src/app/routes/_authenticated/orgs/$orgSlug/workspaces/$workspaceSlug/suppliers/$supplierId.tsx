import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { RiArrowLeftLine } from '@remixicon/react'
import { supplierDetailQueryOptions } from '@/features/suppliers/api/suppliers.api'
import { SupplierDetail } from '@/features/suppliers/components/supplier-detail'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/suppliers/$supplierId',
)({
  beforeLoad: ({ context, params }) => {
    context.queryClient.ensureQueryData(
      supplierDetailQueryOptions(context.workspace.id, params.supplierId),
    )
  },
  component: SupplierDetailPage,
})

function SupplierDetailPage() {
  const { t } = useTranslation('suppliers')
  const { orgSlug, workspaceSlug, supplierId } = Route.useParams()
  const { workspace, organizationDetail } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Link
          to="/orgs/$orgSlug/workspaces/$workspaceSlug/suppliers"
          params={{ orgSlug, workspaceSlug }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RiArrowLeftLine className="size-4" />
          {t('page.backToList')}
        </Link>
      </div>

      <SupplierDetail
        workspaceId={workspace.id}
        supplierId={supplierId}
        timezone={organizationDetail.timezone}
      />
    </div>
  )
}
