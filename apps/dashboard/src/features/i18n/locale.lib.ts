import type { Locale } from 'date-fns'

export type LocaleId = 'en-US' | 'es-PE'

export interface LocaleDefinition {
  id: LocaleId
  label: string
  dateFnsLocale: () => Promise<Locale>
}

export const LOCALES: LocaleDefinition[] = [
  {
    id: 'en-US',
    label: 'English (US)',
    dateFnsLocale: () => import('date-fns/locale/en-US').then((m) => m.enUS),
  },
  {
    id: 'es-PE',
    label: 'Español (Perú)',
    dateFnsLocale: () => import('date-fns/locale/es').then((m) => m.es),
  },
]

export const DEFAULT_LOCALE_ID: LocaleId = 'es-PE'

export function isLocaleId(value: string | null | undefined): value is LocaleId {
  return LOCALES.some((l) => l.id === value)
}
