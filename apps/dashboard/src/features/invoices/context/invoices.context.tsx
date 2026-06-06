import * as React from 'react'
import type { ColumnDef, Table } from '@tanstack/react-table'
import type { Invoice } from '../api/invoices.api'

export interface InvoicesContextValue {
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
    instance: Table<Invoice>
    columns: ColumnDef<Invoice>[]
    isLoading: boolean
    isFetching: boolean
    totalCount: number
  }
  detail: {
    selectedInvoice: Invoice | null
    sheetOpen: boolean
    openDetail: (invoice: Invoice) => void
    closeDetail: () => void
  }
  deletion: {
    deleteInvoice: Invoice | null
    setDeleteInvoice: (invoice: Invoice | null) => void
  }
}

export const InvoicesContext = React.createContext<InvoicesContextValue | null>(
  null,
)

export function useInvoicesContext(): InvoicesContextValue {
  const ctx = React.useContext(InvoicesContext)
  if (!ctx) throw new Error('useInvoicesContext must be used within InvoicesTable')
  return ctx
}
