// Module-level locale string for use in non-component callers (Intl.NumberFormat, etc.)
// Initialized from localStorage so formatMoney() uses the correct locale before React mounts.
const stored = localStorage.getItem('locale')
let activeLocale: string = stored ?? 'es-PE'

export function setActiveLocale(locale: string): void {
  activeLocale = locale
}

export function getActiveLocale(): string {
  return activeLocale
}
