import { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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

export function InvoicesToolbar() {
  const { t } = useTranslation('invoices')
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
        placeholder={t('toolbar.search')}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="h-8 w-64"
      />
      <Select value={filters.statusFilter} onValueChange={filters.onStatusChange}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder={t('toolbar.allStatuses')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{t('toolbar.allStatuses')}</SelectItem>
          {zInvoiceDetailOutputStatusEnum.options.map((s) => (
            <SelectItem key={s} value={s}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`status.${s}` as any, { defaultValue: s })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.typeFilter} onValueChange={filters.onTypeChange}>
        <SelectTrigger size="sm" className="w-44">
          <SelectValue placeholder={t('toolbar.allTypes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{t('toolbar.allTypes')}</SelectItem>
          {zInvoiceTypeEnum.options.map((typeVal) => (
            <SelectItem key={typeVal} value={typeVal}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`type.${typeVal}` as any, { defaultValue: typeVal })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
