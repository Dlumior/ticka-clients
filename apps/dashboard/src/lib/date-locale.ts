import type { Locale } from 'date-fns'
import { es } from 'date-fns/locale/es'

// Module-level date-fns locale ref for use in non-component callers (column defs, etc.)
// Defaults to Spanish since the app default locale is es-PE.
// LocaleProvider updates this after mount via setActiveDateFnsLocale.
let activeDateFnsLocale: Locale = es

export function setActiveDateFnsLocale(locale: Locale): void {
  activeDateFnsLocale = locale
}

export function getActiveDateFnsLocale(): Locale {
  return activeDateFnsLocale
}
