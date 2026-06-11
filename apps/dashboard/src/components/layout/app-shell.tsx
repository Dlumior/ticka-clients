import type { ReactNode } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { OrgRail, ORG_RAIL_WIDTH } from './org-rail'
import { WorkspaceSidebar } from './workspace-sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--rail-width': ORG_RAIL_WIDTH,
        } as React.CSSProperties
      }
      className="[--sidebar-width:16rem] md:[&_[data-slot=sidebar-container]]:left-[var(--rail-width)]!"
    >
      <OrgRail />
      <WorkspaceSidebar />
      <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="text-muted-foreground" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Ticka
          </span>
          <div className="ml-auto flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
