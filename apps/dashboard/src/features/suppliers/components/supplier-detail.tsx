import { useState } from 'react'
import { RiBuilding2Line, RiPencilLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceMembership } from '@/features/members/api/members.api'
import {
  asOrgRole,
  asWorkspaceRole,
  useOrgPermissions,
  useWorkspacePermissions,
} from '@/features/permissions'
import { InvoicesTable } from '@/features/invoices/components/invoices-table'
import { useSupplierDetail } from '../api/suppliers.api'
import type { SupplierDetail as SupplierDetailData } from '../api/suppliers.api'
import { SupplierEditDialog } from './supplier-edit-dialog'

interface SupplierDetailProps {
  workspaceId: string
  supplierId: string
  timezone: string
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={`text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function InfoCard({
  supplier,
  canEdit,
  onEdit,
}: {
  supplier: SupplierDetailData
  canEdit: boolean
  onEdit: () => void
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <RiBuilding2Line className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{supplier.name || '—'}</h2>
        </div>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <RiPencilLine className="size-4" />
            Edit
          </Button>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="RUC" value={supplier.ruc} mono />
        <Field label="Email" value={supplier.email} />
        <Field label="Phone" value={supplier.phone} />
        <Field label="Address" value={supplier.address} />
        <Field label="Invoices" value={supplier.invoice_count} mono />
      </div>
    </div>
  )
}

export function SupplierDetail({
  workspaceId,
  supplierId,
  timezone,
}: SupplierDetailProps) {
  const [editOpen, setEditOpen] = useState(false)
  const { data: supplier, isLoading } = useSupplierDetail(
    workspaceId,
    supplierId,
  )

  const { data: membership } = useWorkspaceMembership(workspaceId)
  const wsRole = asWorkspaceRole(membership?.workspace_role ?? '') ?? 'viewer'
  const orgRole = asOrgRole(membership?.org_role ?? '')
  const wsPerms = useWorkspacePermissions(wsRole, orgRole)
  const orgPerms = useOrgPermissions(orgRole ?? 'viewer')
  const canEdit = wsPerms.isAdmin || orgPerms.canWriteOrganization

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!supplier) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load supplier details.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <InfoCard
        supplier={supplier}
        canEdit={canEdit}
        onEdit={() => setEditOpen(true)}
      />

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Invoices</h3>
        <InvoicesTable
          workspaceId={workspaceId}
          supplierId={supplierId}
          timezone={timezone}
        />
      </div>

      {canEdit && (
        <SupplierEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          workspaceId={workspaceId}
          supplier={supplier}
        />
      )}
    </div>
  )
}
