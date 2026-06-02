import { useEffect, useState } from "react"
import { zInboundEmailStatusEnum } from "@repo/api-types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InboxToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  no_attachments_found: "No attachments",
}

export function InboxToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: InboxToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search by sender or subject..."
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
          {zInboundEmailStatusEnum.options.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s] ?? s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
