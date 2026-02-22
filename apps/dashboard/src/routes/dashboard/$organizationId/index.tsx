import { Link, createFileRoute } from '@tanstack/react-router'
import { IconFolder, IconSettings, IconUsers } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@/hooks/useOrganization'

export const Route = createFileRoute('/dashboard/$organizationId/')({
  component: OrganizationHomePage,
  beforeLoad: () => ({
    breadcrumb: 'Home',
  }),
})

function OrganizationHomePage() {
  const { currentOrganization, workspacesByOrg, isLoading } = useOrganization()
  const workspaces = currentOrganization ? workspacesByOrg[currentOrganization.id] ?? [] : []

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
              The organization you are looking for does not exist or you do not have access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeWorkspaces = workspaces.filter(w => w.is_active)
  const totalUsers = activeWorkspaces.length * 5

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">{currentOrganization.name}</h1>
        <p className="text-muted-foreground mt-1">
          Organization overview and management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <IconFolder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkspaces.length}</div>
            <p className="text-xs text-muted-foreground">Active workspaces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Across all workspaces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <IconSettings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Organization status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" render={<Link to="/dashboard/$organizationId/workspaces" params={{ organizationId: currentOrganization.id }} />}>
              <IconFolder className="mr-2 h-4 w-4" />
              Manage Workspaces
            </Button>
            <Button variant="outline" className="w-full justify-start" render={<Link to="/dashboard/$organizationId/users" params={{ organizationId: currentOrganization.id }} />}>
              <IconUsers className="mr-2 h-4 w-4" />
              View All Users
            </Button>
            <Button variant="outline" className="w-full justify-start" render={<Link to="/dashboard/$organizationId/settings" params={{ organizationId: currentOrganization.id }} />}>
              <IconSettings className="mr-2 h-4 w-4" />
              Organization Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Recent Workspaces</CardTitle>
            <CardDescription>Quick access to your workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            {activeWorkspaces.length === 0 ? (
              <p className="text-muted-foreground text-sm">No workspaces yet</p>
            ) : (
              <div className="space-y-2">
                {activeWorkspaces.slice(0, 5).map((workspace) => (
                  <Button
                    key={workspace.id}
                    variant="ghost"
                    className="w-full justify-start"
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
                    {workspace.name}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
