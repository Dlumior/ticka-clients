import { useState } from 'react'
import { useEffect } from 'react'
import { zInvoiceDetailOutputStatusEnum, zInvoiceTypeEnum } from '@repo/api-types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInvoicesContext } from '../context/invoices.context'
import { INVOICE_STATUS_LABEL, INVOICE_TYPE_LABEL } from '../invoices.lib'

export function InvoicesToolbar() {
  const { filters } = useInvoicesContext()
  const { onSearchChange } = filters
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search by number or supplier..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="h-8 w-64"
      />
      <Select value={filters.statusFilter} onValueChange={filters.onStatusChange}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          {zInvoiceDetailOutputStatusEnum.options.map((s) => (
            <SelectItem key={s} value={s}>
              {INVOICE_STATUS_LABEL[s] ?? s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.typeFilter} onValueChange={filters.onTypeChange}>
        <SelectTrigger size="sm" className="w-44">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All types</SelectItem>
          {zInvoiceTypeEnum.options.map((t) => (
            <SelectItem key={t} value={t}>
              {INVOICE_TYPE_LABEL[t] ?? t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
