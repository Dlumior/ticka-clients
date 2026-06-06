import { useCallback, useState } from 'react'
import type { InboundEmail } from '../api/inbox.api'

interface UseInboxDetailOptions {
  initialEmailId?: string
}

export function useInboxDetail({ initialEmailId }: UseInboxDetailOptions = {}) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(
    initialEmailId ?? null,
  )
  const [sheetOpen, setSheetOpen] = useState(!!initialEmailId)

  const openDetail = useCallback((email: InboundEmail) => {
    setSelectedEmailId(email.id)
    setSheetOpen(true)
  }, [])

  const closeDetail = useCallback(() => {
    setSheetOpen(false)
    setSelectedEmailId(null)
  }, [])

  return { selectedEmailId, sheetOpen, openDetail, closeDetail }
}
