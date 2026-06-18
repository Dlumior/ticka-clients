// TypeScript module augmentation for type-safe t() calls.
// Only en-US.json files drive the types — es.json / es-PE.json are partial and not typed.
// Adding a key to en-US.json immediately makes it available (and required) in t() calls.
import type commonEn from '@/features/common/locales/en-US.json'
import type authEn from '@/features/auth/locales/en-US.json'
import type billingDocumentsEn from '@/features/billing-documents/locales/en-US.json'
import type inboxEn from '@/features/inbox/locales/en-US.json'
import type membersEn from '@/features/members/locales/en-US.json'
import type organizationsEn from '@/features/organizations/locales/en-US.json'
import type workspacesEn from '@/features/workspaces/locales/en-US.json'
import type suppliersEn from '@/features/suppliers/locales/en-US.json'
import type permissionsEn from '@/features/permissions/locales/en-US.json'
import type layoutEn from '@/features/layout/locales/en-US.json'
import type workbenchEn from '@/features/workbench/locales/en-US.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonEn
      auth: typeof authEn
      'billing-documents': typeof billingDocumentsEn
      inbox: typeof inboxEn
      members: typeof membersEn
      organizations: typeof organizationsEn
      workspaces: typeof workspacesEn
      suppliers: typeof suppliersEn
      permissions: typeof permissionsEn
      layout: typeof layoutEn
      workbench: typeof workbenchEn
    }
  }
}
