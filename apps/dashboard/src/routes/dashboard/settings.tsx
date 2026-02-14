import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useWorkspace } from '@/hooks/useWorkspace'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
  context: () => ({
    breadcrumb: 'Settings',
  }),
})

function SettingsPage() {
  const { currentWorkspace } = useWorkspace()

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif">Select a Workspace</CardTitle>
            <CardDescription>
              Please select a workspace to view settings
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace configuration
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Information</CardTitle>
            <CardDescription>
              Update your workspace details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                defaultValue={currentWorkspace.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace-slug">Workspace Slug</Label>
              <Input
                id="workspace-slug"
                defaultValue={currentWorkspace.slug}
                disabled
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your workspace
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-red-600">Delete Workspace</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and all its data
                </p>
              </div>
              <Button variant="destructive">Delete Workspace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
