import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'

interface SuppliersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function SuppliersToolbar({
  search,
  onSearchChange,
}: SuppliersToolbarProps) {
  const { t } = useTranslation('suppliers')
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
        placeholder={t('toolbar.search')}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="h-8 w-64"
      />
    </div>
  )
}
