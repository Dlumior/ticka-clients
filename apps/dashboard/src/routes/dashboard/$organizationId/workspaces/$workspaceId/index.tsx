import { Link, createFileRoute } from '@tanstack/react-router'
import { IconFileInvoice, IconLoader2, IconSettings, IconUsers } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@/hooks/useOrganization'
import { useCurrentUser } from '@/hooks/useAuth'

export const Route = createFileRoute('/dashboard/$organizationId/workspaces/$workspaceId/')({
  component: WorkspaceHomePage,
  beforeLoad: () => ({
    breadcrumb: 'Home',
  }),
})

function WorkspaceHomePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { currentOrganization, currentWorkspace, isLoading } = useOrganization()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!currentOrganization || !currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif">Workspace Not Found</CardTitle>
            <CardDescription>
              The workspace you are looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-ticka-gradient">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to {currentWorkspace.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue" value="$45,231.89" change="+20.1%" trend="up" />
        <MetricCard title="Active Projects" value="12" change="+3" trend="up" />
        <MetricCard title="Tasks Completed" value="89" change="+12" trend="up" />
        <MetricCard title="Team Members" value="24" change="+2" trend="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="backdrop-ticka">
          <CardHeader>
            <CardTitle className="font-serif">Account Information</CardTitle>
            <CardDescription>Your profile details and account status</CardDescription>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg">{user.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-lg">
                    {new Date(user.date_joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Unable to load user information</p>
            )}
          </CardContent>
        </Card>

        <Card className="backdrop-ticka">
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" render={
              <Link
                to="/dashboard/$organizationId/workspaces/$workspaceId/invoices"
                params={{ organizationId: currentOrganization.id, workspaceId: currentWorkspace.id }}
              />
            }>
              <IconFileInvoice className="mr-2 h-4 w-4" />
              View Invoices
            </Button>
            <Button variant="outline" className="w-full justify-start" render={
              <Link
                to="/dashboard/$organizationId/workspaces/$workspaceId/users"
                params={{ organizationId: currentOrganization.id, workspaceId: currentWorkspace.id }}
              />
            }>
              <IconUsers className="mr-2 h-4 w-4" />
              Team Members
            </Button>
            <Button variant="outline" className="w-full justify-start" render={
              <Link
                to="/dashboard/$organizationId/workspaces/$workspaceId/settings"
                params={{ organizationId: currentOrganization.id, workspaceId: currentWorkspace.id }}
              />
            }>
              <IconSettings className="mr-2 h-4 w-4" />
              Workspace Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-ticka">
        <CardHeader>
          <CardTitle className="font-serif">Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No recent activity to display</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

function MetricCard({ title, value, change, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
