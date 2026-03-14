import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { IconMail, IconTrash, IconUserPlus } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrganization } from '@/hooks/useOrganization'
import {
  listWorkspaceMembers,
  inviteToWorkspace,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
  type WorkspaceMember,
  type WorkspaceRole,
} from '@/lib/api/workspace-members'

export const Route = createFileRoute(
  '/dashboard/$organizationId/workspaces/$workspaceId/users',
)({
  component: WorkspaceUsersPage,
  beforeLoad: () => ({
    breadcrumb: 'Users',
  }),
})

function WorkspaceUsersPage() {
  const {
    currentOrganization,
    currentWorkspace,
    isLoading: orgLoading,
  } = useOrganization()
  const queryClient = useQueryClient()
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const {
    data: members,
    isLoading: membersLoading,
    error,
  } = useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: () => listWorkspaceMembers(currentWorkspace!.id),
    enabled: !!currentWorkspace?.id,
  })

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: WorkspaceRole }) =>
      inviteToWorkspace(currentWorkspace!.id, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', currentWorkspace?.id],
      })
      setIsInviteDialogOpen(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (memberId: string) =>
      removeWorkspaceMember(currentWorkspace!.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', currentWorkspace?.id],
      })
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string
      role: WorkspaceRole
    }) => updateWorkspaceMemberRole(currentWorkspace!.id, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', currentWorkspace?.id],
      })
    },
  })

  if (orgLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Workspace Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage members in {currentWorkspace.name}
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <IconUserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            }
          ></DialogTrigger>
          <InviteUserDialog
            onSubmit={(email, role) => inviteMutation.mutate({ email, role })}
            isLoading={inviteMutation.isPending}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members</CardTitle>
          <CardDescription>
            {members?.length ?? 0} members in {currentWorkspace.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="animate-pulse text-muted-foreground">
              Loading members...
            </div>
          ) : error ? (
            <div className="text-red-500">Failed to load members</div>
          ) : members?.length === 0 ? (
            <div className="text-muted-foreground">
              No members yet. Invite someone to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {members?.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onRemove={() => removeMutation.mutate(member.id)}
                  onRoleChange={(role) =>
                    updateRoleMutation.mutate({ memberId: member.id, role })
                  }
                  isRemoving={removeMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InviteUserDialog({
  onSubmit,
  isLoading,
}: {
  onSubmit: (email: string, role: WorkspaceRole) => void
  isLoading: boolean
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceRole>('member')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, role)
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Invite User to Workspace</DialogTitle>
          <DialogDescription>
            Enter the email address and select the role for the new member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as WorkspaceRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Inviting...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function MemberRow({
  member,
  onRemove,
  onRoleChange,
  isRemoving,
}: {
  member: WorkspaceMember
  onRemove: () => void
  onRoleChange: (role: WorkspaceRole) => void
  isRemoving: boolean
}) {
  const userName =
    [member.user.first_name, member.user.last_name].filter(Boolean).join(' ') ||
    member.user.email

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMail className="h-3 w-3" />
            {member.user.email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <Select
            value={member.role}
            onValueChange={(v) => onRoleChange(v as WorkspaceRole)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            Joined {new Date(member.joined_at).toLocaleDateString()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600"
          onClick={onRemove}
          disabled={isRemoving}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
