import { useEffect, useState } from 'react'
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
import { EMAIL_STATUS_LABEL } from '../inbox.lib'

export function InboxToolbar() {
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
        placeholder="Search by sender or subject..."
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
          {zInboundEmailStatusEnum.options.map((s) => (
            <SelectItem key={s} value={s}>
              {EMAIL_STATUS_LABEL[s] ?? s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
