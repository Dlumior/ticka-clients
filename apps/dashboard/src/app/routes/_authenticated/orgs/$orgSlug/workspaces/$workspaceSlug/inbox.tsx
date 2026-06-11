import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import {
  RiMailLine,
  RiUploadCloud2Line,
  RiWhatsappLine,
  RiTelegramLine,
} from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InboxTable } from '@/features/inbox/components/inbox-table'
import { ManualUploadTab } from '@/features/inbox/components/manual-upload'

const TAB_VALUES = ['email', 'upload', 'whatsapp', 'telegram'] as const
type TabValue = (typeof TAB_VALUES)[number]

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/inbox',
)({
  validateSearch: z.object({
    tab: z.enum(TAB_VALUES).default('email'),
    emailId: z.string().optional(),
    attachmentId: z.string().optional(),
  }),
  component: InboxPage,
})

function InboxPage() {
  const { workspace, organizationDetail } = Route.useRouteContext()
  const { tab, emailId, attachmentId } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { t } = useTranslation('inbox')

  function onTabChange(value: string) {
    // Switching tabs clears any deep-link target so a stale sheet doesn't reopen.
    navigate({ search: { tab: value as TabValue }, replace: true })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t('page.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('page.subtitle')}</p>
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="flex flex-col gap-4">
        <TabsList variant="line" className="w-full justify-start gap-1 p-0">
          <TabsTrigger value="email" className="gap-2">
            <RiMailLine className="size-4" />
            {t('tabs.email')}
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <RiUploadCloud2Line className="size-4" />
            {t('tabs.upload')}
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2" disabled>
            <RiWhatsappLine className="size-4" />
            {t('tabs.whatsapp')}
            <span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
              {t('page.soon')}
            </span>
          </TabsTrigger>
          <TabsTrigger value="telegram" className="gap-2" disabled>
            <RiTelegramLine className="size-4" />
            {t('tabs.telegram')}
            <span className="ml-1 rounded-full bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
              {t('page.soon')}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {t('page.emailHelp')}{' '}
              <span className="font-mono text-foreground">{workspace.inbox_email}</span>.
            </p>
            <InboxTable
              workspaceId={workspace.id}
              timezone={organizationDetail.timezone}
              initialEmailId={emailId}
            />
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <ManualUploadTab
            workspaceId={workspace.id}
            timezone={organizationDetail.timezone}
            highlightAttachmentId={attachmentId}
          />
        </TabsContent>

        <TabsContent value="whatsapp">
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <RiWhatsappLine className="size-8 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium">{t('page.whatsappTitle')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('page.whatsappDesc')}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="telegram">
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <RiTelegramLine className="size-8 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium">{t('page.telegramTitle')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('page.telegramDesc')}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
