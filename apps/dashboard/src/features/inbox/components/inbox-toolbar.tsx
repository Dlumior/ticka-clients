import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { zInboundEmailStatusEnum } from '@repo/api-types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInboxTableContext } from '../context/inbox-table.context'

export function InboxToolbar() {
  const { t } = useTranslation('inbox')
  const { filters } = useInboxTableContext()
  const { onSearchChange } = filters
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  return (
    <div className="flex items-center gap-2">
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
          {zInboundEmailStatusEnum.options.map((s) => (
            <SelectItem key={s} value={s}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`emailStatus.${s}` as any, { defaultValue: s })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
