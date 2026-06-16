import type { ComponentProps } from 'react'
import type { Badge } from '@/components/ui/badge'
import i18next from 'i18next'
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

export const INVOICE_TYPE_VARIANT: Record<string, BadgeVariant> = {
  factura: 'default',
  boleta: 'default',
  nota_credito: 'outline',
  nota_debito: 'outline',
  comunicacion_baja: 'secondary',
  resumen_diario: 'secondary',
  guia_remitente: 'secondary',
}

export const SUNAT_ADMIN_TYPES = new Set([
  'comunicacion_baja',
  'resumen_diario',
  'guia_remitente',
])

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
  return i18next.t(`type.${type}`, { ns: 'invoices', defaultValue: type })
}

export function typeVariant(type: string | null | undefined): BadgeVariant {
  if (!type) return 'outline'
  return INVOICE_TYPE_VARIANT[type] ?? 'outline'
}
