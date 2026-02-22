import {
  IconFileInvoice,
  IconFolder,
  IconFolders,
  IconHome,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  icon: ComponentType<{ className?: string }>
  to: string
  params: Record<string, string>
  exact?: boolean
}

export const getOrgNavItems = (organizationId: string): Array<NavItem> => [
  {
    label: 'Home',
    icon: IconHome,
    to: '/dashboard/$organizationId',
    params: { organizationId },
    exact: true,
  },
  {
    label: 'Users',
    icon: IconUsers,
    to: '/dashboard/$organizationId/users',
    params: { organizationId },
  },
  {
    label: 'Settings',
    icon: IconSettings,
    to: '/dashboard/$organizationId/settings',
    params: { organizationId },
  },
  {
    label: 'Workspaces',
    icon: IconFolders,
    to: '/dashboard/$organizationId/workspaces',
    params: { organizationId },
  },
]

export const getWorkspaceNavItems = (
  organizationId: string,
  workspaceId: string,
): Array<NavItem> => [
  {
    label: 'Home',
    icon: IconHome,
    to: '/dashboard/$organizationId/workspaces/$workspaceId',
    params: { organizationId, workspaceId },
    exact: true,
  },
  {
    label: 'Invoices',
    icon: IconFileInvoice,
    to: '/dashboard/$organizationId/workspaces/$workspaceId/invoices',
    params: { organizationId, workspaceId },
  },
  {
    label: 'Users',
    icon: IconUsers,
    to: '/dashboard/$organizationId/workspaces/$workspaceId/users',
    params: { organizationId, workspaceId },
  },
  {
    label: 'Settings',
    icon: IconSettings,
    to: '/dashboard/$organizationId/workspaces/$workspaceId/settings',
    params: { organizationId, workspaceId },
  },
]

export const getWorkspaceListItems = (
  organizationId: string,
  workspaces: Array<{ id: string; name: string }>,
): Array<NavItem> =>
  workspaces.map((ws) => ({
    label: ws.name,
    icon: IconFolder,
    to: '/dashboard/$organizationId/workspaces/$workspaceId',
    params: { organizationId, workspaceId: ws.id },
    exact: true,
  }))
