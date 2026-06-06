import * as React from 'react'
import type { ColumnDef, Table } from '@tanstack/react-table'
import type { InboundEmail } from '../api/inbox.api'

export interface InboxTableContextValue {
  workspaceId: string
  timezone: string
  filters: {
    search: string
    statusFilter: string
    onSearchChange: (v: string) => void
    onStatusChange: (v: string) => void
  }
  table: {
    instance: Table<InboundEmail>
    columns: ColumnDef<InboundEmail>[]
    isLoading: boolean
    isFetching: boolean
    totalCount: number
  }
  detail: {
    selectedEmailId: string | null
    sheetOpen: boolean
    openDetail: (email: InboundEmail) => void
    closeDetail: () => void
  }
}

export const InboxTableContext = React.createContext<InboxTableContextValue | null>(null)

export function useInboxTableContext(): InboxTableContextValue {
  const ctx = React.useContext(InboxTableContext)
  if (!ctx) throw new Error('useInboxTableContext must be used within InboxTable')
  return ctx
}
