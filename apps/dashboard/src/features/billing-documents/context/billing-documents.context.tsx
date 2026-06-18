import * as React from 'react'
import type { ColumnDef, Table } from '@tanstack/react-table'
import type { BillingDocument } from '../api/billing-documents.api'

export interface BillingDocumentsContextValue {
  workspaceId: string
  timezone: string
  permissions: {
    canManage: boolean
  }
  filters: {
    search: string
    statusFilter: string
    typeFilter: string
    onSearchChange: (v: string) => void
    onStatusChange: (v: string) => void
    onTypeChange: (v: string) => void
  }
  table: {
    instance: Table<BillingDocument>
    columns: ColumnDef<BillingDocument>[]
    isLoading: boolean
    isFetching: boolean
    totalCount: number
  }
  detail: {
    selectedBillingDocument: BillingDocument | null
    sheetOpen: boolean
    openDetail: (billingDocument: BillingDocument) => void
    closeDetail: () => void
  }
  deletion: {
    deleteBillingDocument: BillingDocument | null
    setDeleteBillingDocument: (billingDocument: BillingDocument | null) => void
  }
}

export const BillingDocumentsContext = React.createContext<BillingDocumentsContextValue | null>(
  null,
)

export function useBillingDocumentsContext(): BillingDocumentsContextValue {
  const ctx = React.useContext(BillingDocumentsContext)
  if (!ctx) throw new Error('useBillingDocumentsContext must be used within BillingDocumentsTable')
  return ctx
}
