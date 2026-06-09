/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import i18next from 'i18next'
import { setActiveDateFnsLocale } from '@/lib/date-locale'
import { setActiveLocale } from '@/lib/locale-ref'
import { DEFAULT_LOCALE_ID, LOCALES, isLocaleId, type LocaleId } from './locale.lib'

const STORAGE_KEY = 'locale'

type LocaleContextState = {
  locale: LocaleId
  setLocale: (locale: LocaleId) => void
}

const LocaleContext = React.createContext<LocaleContextState | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<LocaleId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLocaleId(stored) ? stored : DEFAULT_LOCALE_ID
  })

  // Load and set the date-fns locale whenever locale changes (including on mount)
  React.useEffect(() => {
    const def = LOCALES.find((l) => l.id === locale)
    def?.dateFnsLocale().then(setActiveDateFnsLocale)
  }, [locale])

  const setLocale = React.useCallback((next: LocaleId) => {
    localStorage.setItem(STORAGE_KEY, next)
    setActiveLocale(next)
    void i18next.changeLanguage(next)
    setLocaleState(next)
  }, [])

  // Cross-tab sync — same pattern as ThemeProvider
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.storageArea !== localStorage || e.key !== STORAGE_KEY) return
      if (isLocaleId(e.newValue)) {
        setActiveLocale(e.newValue)
        void i18next.changeLanguage(e.newValue)
        setLocaleState(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = React.useMemo(() => ({ locale, setLocale }), [locale, setLocale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = React.useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
