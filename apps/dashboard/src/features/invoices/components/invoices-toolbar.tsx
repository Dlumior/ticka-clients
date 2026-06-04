import { useEffect, useState } from 'react'
import { zInvoiceDetailOutputStatusEnum, zInvoiceTypeEnum } from '@repo/api-types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { INVOICE_STATUS_LABEL, INVOICE_TYPE_LABEL } from '../invoices.lib'

interface InvoicesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  invoiceType: string
  onInvoiceTypeChange: (value: string) => void
}

export function InvoicesToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  invoiceType,
  onInvoiceTypeChange,
}: InvoicesToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search)

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
      <Select value={status} onValueChange={onStatusChange}>
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
      <Select value={invoiceType} onValueChange={onInvoiceTypeChange}>
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
