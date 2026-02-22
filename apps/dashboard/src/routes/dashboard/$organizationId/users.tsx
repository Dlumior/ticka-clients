import { createFileRoute } from '@tanstack/react-router'
import { IconMail, IconTrash } from '@tabler/icons-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@/hooks/useOrganization'

const mockOrgUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', workspace: 'Marketing', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member', workspace: 'Development', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Member', workspace: 'Marketing', status: 'Pending' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Viewer', workspace: 'Development', status: 'Active' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Admin', workspace: 'Development', status: 'Active' },
  { id: '6', name: 'Diana Ross', email: 'diana@example.com', role: 'Member', workspace: 'Sales', status: 'Active' },
]

export const Route = createFileRoute('/dashboard/$organizationId/users')({
  component: OrganizationUsersPage,
  beforeLoad: () => ({
    breadcrumb: 'Users',
  }),
})

function OrganizationUsersPage() {
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
              The organization you are looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const activeWorkspaces = workspaces.filter(w => w.is_active)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Organization Users</h1>
          <p className="text-muted-foreground mt-1">
            All users across {activeWorkspaces.length} workspaces
          </p>
        </div>
        <Button>Invite User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>
            {mockOrgUsers.length} users in {currentOrganization.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrgUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconMail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline">{user.workspace}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{user.status}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-600">
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
