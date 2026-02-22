import { IconChevronRight } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar'

interface NavSectionProps {
  label: string
  name: string
  children: ReactNode
}

export function NavSection({ label, name, children }: NavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger render={<SidebarMenuButton tooltip={name} />}>
              <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="truncate">{name}</span>
              <IconChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>{children}</SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
