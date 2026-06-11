import { useTranslation } from 'react-i18next'
import { useLocale } from '@/features/i18n/locale.context'
import { LOCALES } from '@/features/i18n/locale.lib'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RiArrowDownSLine, RiCheckLine, RiTranslate2 } from '@remixicon/react'

export function LocaleSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation('common')
  const { locale, setLocale } = useLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('changeLanguage')}
        className={cn(
          'group flex items-center gap-1 rounded-lg border border-border bg-muted px-2 py-2 text-sm font-medium transition-colors',
          'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className,
        )}
      >
        <RiTranslate2 />
        <RiArrowDownSLine className="size-4 shrink-0 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        {LOCALES.map((l) => (
          <DropdownMenuItem key={l.id} onClick={() => setLocale(l.id)}>
            <span className="flex-1">{l.label}</span>
            {locale === l.id && <RiCheckLine className="ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
