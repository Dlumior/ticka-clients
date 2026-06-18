import { useCallback, useMemo, useState } from 'react'
import type { ExportFilters, ExportSelection } from '../api/workbench.api'

/**
 * Selection store for the workbench browse tab.
 *
 * Two modes back the same UI: hand-picked `explicit` ids (whole billing documents
 * and/or individual line items), or `selectAllMatching` which captures the active
 * filters and lets the backend resolve them — so "all documents of two
 * suppliers" never has to enumerate thousands of ids client-side. Any manual
 * toggle drops back to explicit mode.
 */
export function useWorkbenchSelection() {
  const [selectAllMatching, setSelectAllMatching] = useState(false)
  const [billingDocumentIds, setBillingDocumentIds] = useState<Set<string>>(new Set())
  const [lineItemIds, setLineItemIds] = useState<Set<string>>(new Set())

  const toggleBillingDocument = useCallback((id: string) => {
    setSelectAllMatching(false)
    setBillingDocumentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleLineItem = useCallback((id: string) => {
    setSelectAllMatching(false)
    setLineItemIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const enableSelectAllMatching = useCallback(() => {
    setSelectAllMatching(true)
    setBillingDocumentIds(new Set())
    setLineItemIds(new Set())
  }, [])

  const clear = useCallback(() => {
    setSelectAllMatching(false)
    setBillingDocumentIds(new Set())
    setLineItemIds(new Set())
  }, [])

  const explicitCount = billingDocumentIds.size + lineItemIds.size
  const hasSelection = selectAllMatching || explicitCount > 0

  const buildSelection = useCallback(
    (filters: ExportFilters): ExportSelection => {
      if (selectAllMatching) {
        return { mode: 'filter', filters }
      }
      return {
        mode: 'explicit',
        billing_document_ids: [...billingDocumentIds],
        line_item_ids: [...lineItemIds],
      }
    },
    [selectAllMatching, billingDocumentIds, lineItemIds],
  )

  return useMemo(
    () => ({
      selectAllMatching,
      billingDocumentIds,
      lineItemIds,
      explicitCount,
      hasSelection,
      isBillingDocumentSelected: (id: string) => billingDocumentIds.has(id),
      isLineItemSelected: (id: string) => lineItemIds.has(id),
      toggleBillingDocument,
      toggleLineItem,
      enableSelectAllMatching,
      clear,
      buildSelection,
    }),
    [
      selectAllMatching,
      billingDocumentIds,
      lineItemIds,
      explicitCount,
      hasSelection,
      toggleBillingDocument,
      toggleLineItem,
      enableSelectAllMatching,
      clear,
      buildSelection,
    ],
  )
}

export type WorkbenchSelection = ReturnType<typeof useWorkbenchSelection>
