import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { IconPlus, IconSettings, IconUsers } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrganization } from '@/hooks/useOrganization'

export const Route = createFileRoute('/dashboard/$organizationId/workspaces/')({
  component: WorkspacesPage,
  beforeLoad: () => ({
    breadcrumb: 'Workspaces',
  }),
})

function WorkspacesPage() {
  const {
    currentOrganization,
    workspacesByOrg,
    isLoading,
    createWorkspaceMutation,
  } = useOrganization()
  const workspaces = currentOrganization
    ? (workspacesByOrg[currentOrganization.id] ?? [])
    : []
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif">Organization Not Found</CardTitle>
            <CardDescription>
              The organization you are looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeWorkspaces = workspaces.filter((w) => w.is_active)

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return
    createWorkspaceMutation.mutate(
      { organizationId: currentOrganization.id, name: newWorkspaceName.trim() },
      {
        onSuccess: () => {
          setNewWorkspaceName('')
          setShowForm(false)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage workspaces in {currentOrganization.name}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workspace</CardTitle>
            <CardDescription>
              Add a new workspace to your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateWorkspace}
                disabled={
                  !newWorkspaceName.trim() || createWorkspaceMutation.isPending
                }
              >
                {createWorkspaceMutation.isPending
                  ? 'Creating...'
                  : 'Create Workspace'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeWorkspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {workspace.name}
              </CardTitle>
              <CardDescription>
                ID: {workspace.id.slice(0, 8)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link
                      to="/dashboard/$organizationId/workspaces/$workspaceId"
                      params={{
                        organizationId: currentOrganization.id,
                        workspaceId: workspace.id,
                      }}
                    />
                  }
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link
                      to="/dashboard/$organizationId/workspaces/$workspaceId/settings"
                      params={{
                        organizationId: currentOrganization.id,
                        workspaceId: workspace.id,
                      }}
                    />
                  }
                >
                  <IconSettings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  render={
                    <Link
                      to="/dashboard/$organizationId/workspaces/$workspaceId/users"
                      params={{
                        organizationId: currentOrganization.id,
                        workspaceId: workspace.id,
                      }}
                    />
                  }
                >
                  <IconUsers className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeWorkspaces.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No workspaces yet</p>
            <Button onClick={() => setShowForm(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              Create your first workspace
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
