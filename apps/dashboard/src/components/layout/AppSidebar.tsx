import { OrganizationSelector } from './OrganizationSelector'
import { SidebarNavigation } from './SidebarNavigation'
import { SidebarUserMenu } from './SidebarUserMenu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center px-2 py-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:text-sm transition-all duration-200">
            <span className="font-serif font-bold text-lg group-data-[collapsible=icon]:text-sm">
              T
            </span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-3">
            <span className="truncate font-serif font-bold text-lg">Ticka</span>
          </div>
        </div>
        <div className="px-2 group-data-[collapsible=icon]:hidden">
          <OrganizationSelector />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
