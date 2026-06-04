import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface SuppliersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function SuppliersToolbar({
  search,
  onSearchChange,
}: SuppliersToolbarProps) {
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
        placeholder="Search by name or RUC..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="h-8 w-64"
      />
    </div>
  )
}
