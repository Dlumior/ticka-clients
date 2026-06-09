import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkbenchTab } from './browse/workbench-tab'
import { TemplatesTab } from './templates/templates-tab'
import { ExportsTab } from './exports/exports-tab'

export type WorkbenchTabKey = 'workbench' | 'templates' | 'exports'

interface WorkbenchPageProps {
  workspaceId: string
  timezone: string
  tab: WorkbenchTabKey
  onTabChange: (tab: WorkbenchTabKey) => void
}

export function WorkbenchPage({
  workspaceId,
  timezone,
  tab,
  onTabChange,
}: WorkbenchPageProps) {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => onTabChange(value as WorkbenchTabKey)}
    >
      <TabsList>
        <TabsTrigger value="workbench">Workbench</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="exports">Exports</TabsTrigger>
      </TabsList>

      <TabsContent value="workbench" className="pt-4">
        <WorkbenchTab
          workspaceId={workspaceId}
          timezone={timezone}
          onExported={() => onTabChange('exports')}
        />
      </TabsContent>
      <TabsContent value="templates" className="pt-4">
        <TemplatesTab workspaceId={workspaceId} />
      </TabsContent>
      <TabsContent value="exports" className="pt-4">
        <ExportsTab workspaceId={workspaceId} timezone={timezone} />
      </TabsContent>
    </Tabs>
  )
}
