import type { ComponentProps } from 'react'
import type { Badge } from '@/components/ui/badge'
import { getActiveLocale } from '@/lib/locale-ref'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

// Backend amounts arrive as DRF decimal strings. Format with the invoice
// currency, falling back to a plain grouped number for unknown codes.
export function formatMoney(
  amount: string | null | undefined,
  currency: string | null | undefined,
): string {
  if (amount == null || amount === '') return '—'
  const value = Number(amount)
  if (Number.isNaN(value)) return amount
  const code = (currency || '').toUpperCase()
  try {
    return new Intl.NumberFormat(getActiveLocale(), {
      style: 'currency',
      currency: code || 'PEN',
    }).format(value)
  } catch {
    return `${value.toLocaleString(getActiveLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${code ? ` ${code}` : ''}`
  }
}

// Plain number (no currency symbol) — line-item quantities/prices.
export function formatNumber(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString(getActiveLocale(), { maximumFractionDigits: 4 })
}

export const INVOICE_STATUS_VARIANT: Record<string, BadgeVariant> = {
  received: 'secondary',
  parsing: 'outline',
  parsed: 'outline',
  review_needed: 'secondary',
  approved: 'default',
  exported: 'default',
  failed: 'destructive',
}

export const INVOICE_STATUS_LABEL: Record<string, string> = {
  received: 'Received',
  parsing: 'Parsing',
  parsed: 'Parsed',
  review_needed: 'Review needed',
  approved: 'Approved',
  exported: 'Exported',
  failed: 'Failed',
}

export const INVOICE_TYPE_LABEL: Record<string, string> = {
  factura: 'Factura',
  boleta: 'Boleta',
  nota_credito: 'Nota de Crédito',
  nota_debito: 'Nota de Débito',
}

export function statusLabel(status: string | null | undefined): string {
  if (!status) return '—'
  return INVOICE_STATUS_LABEL[status] ?? status
}

export function statusVariant(status: string | null | undefined): BadgeVariant {
  if (!status) return 'outline'
  return INVOICE_STATUS_VARIANT[status] ?? 'outline'
}

export function typeLabel(type: string | null | undefined): string {
  if (!type) return '—'
  return INVOICE_TYPE_LABEL[type] ?? type
}
