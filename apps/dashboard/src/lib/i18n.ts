import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { isLocaleId } from '@/features/i18n/locale.lib'

// Eagerly collect all feature locale JSON files at build time.
// Path pattern (relative to this file): ../features/<ns>/locales/<locale>.json
const modules = import.meta.glob<{ default: Record<string, unknown> }>(
  '../features/*/locales/*.json',
  { eager: true },
)

type NamespaceResources = Record<string, unknown>
type LocaleResources = Record<string, NamespaceResources>

function buildResources(): Record<string, LocaleResources> {
  const resources: Record<string, LocaleResources> = {}
  for (const [path, mod] of Object.entries(modules)) {
    const match = path.match(/features\/([^/]+)\/locales\/([^/]+)\.json$/)
    if (!match) continue
    const [, ns, locale] = match
    resources[locale] ??= {}
    resources[locale][ns] = mod.default
  }
  return resources
}

const stored = localStorage.getItem('locale')
const initialLocale = isLocaleId(stored) ? stored : 'es-PE'

void i18next.use(initReactI18next).init({
  lng: initialLocale,
  fallbackLng: {
    'es-PE': ['es', 'en-US'],
    'es-AR': ['es', 'en-US'],
    'es-CL': ['es', 'en-US'],
    es: ['en-US'],
    default: ['en-US'],
  },
  ns: [
    'common',
    'auth',
    'invoices',
    'inbox',
    'members',
    'organizations',
    'workspaces',
    'suppliers',
    'permissions',
    'layout',
    'workbench',
  ],
  defaultNS: 'common',
  resources: buildResources(),
  interpolation: { escapeValue: false },
})

export default i18next
