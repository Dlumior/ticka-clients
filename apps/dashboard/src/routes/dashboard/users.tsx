import { IconMail, IconTrash } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@/hooks/useOrganization'

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Member', status: 'Pending' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Viewer', status: 'Active' },
]

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
  context: () => ({
    breadcrumb: 'Users',
  }),
})

function UsersPage() {
  const { currentWorkspace } = useOrganization()

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif">Select a Workspace</CardTitle>
            <CardDescription>
              Please select a workspace to view users
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage workspace members and their roles
          </p>
        </div>
        <Button>Invite User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members</CardTitle>
          <CardDescription>
            {mockUsers.length} members in {currentWorkspace.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
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
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
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
