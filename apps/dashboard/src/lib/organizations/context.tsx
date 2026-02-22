import { createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useOrganizationsQuery, useWorkspacesQuery } from './queries'
import { useCreateWorkspaceMutation } from './mutations'
import type { ReactNode } from 'react'
import type { Organization } from '@/lib/api/organizations'
import type {
  WorkspaceBrief,
  WorkspaceBriefWithOrg,
} from '@/lib/api/workspaces'

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface OrganizationContextType {
  organizations: Array<Organization>
  workspacesByOrg: Record<string, Array<WorkspaceBrief> | undefined>
  currentOrganization: Organization | null
  currentWorkspace: WorkspaceBriefWithOrg | null
  setCurrentOrganization: (org: Organization) => void
  setCurrentWorkspace: (workspace: WorkspaceBriefWithOrg) => void
  isLoading: boolean
  createWorkspaceMutation: ReturnType<typeof useCreateWorkspaceMutation>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const params = useParams({ strict: false })
  const navigate = useNavigate()
  const { organizationId, workspaceId } = params

  // Data fetching
  const { data: organizations = [], isLoading } = useOrganizationsQuery()

  const activeOrgIds = useMemo(
    () => organizations.filter((o) => o.is_active).map((o) => o.id),
    [organizations],
  )

  const { data: allWorkspaces = [] } = useWorkspacesQuery(activeOrgIds)

  // Derived state
  const workspacesByOrg = useMemo(
    () =>
      allWorkspaces.reduce<Record<string, Array<WorkspaceBrief>>>((acc, ws) => {
        ;(acc[ws.organizationId] ??= []).push(ws)
        return acc
      }, {}),
    [allWorkspaces],
  )

  const currentOrganization = useMemo(
    () =>
      organizations.find((o) => o.id === organizationId && o.is_active) ?? null,
    [organizations, organizationId],
  )

  const currentWorkspace = useMemo(
    () =>
      allWorkspaces.find((w) => w.id === workspaceId && w.is_active) ?? null,
    [allWorkspaces, workspaceId],
  )

  // Navigation
  const setCurrentOrganization = useCallback(
    (org: Organization) => {
      const firstActiveWorkspace = workspacesByOrg[org.id].find(
        (w) => w.is_active,
      )

      if (firstActiveWorkspace) {
        navigate({
          to: '/dashboard/$organizationId/workspaces/$workspaceId',
          params: {
            organizationId: org.id,
            workspaceId: firstActiveWorkspace.id,
          },
        })
      } else {
        navigate({
          to: '/dashboard/$organizationId',
          params: { organizationId: org.id },
        })
      }
    },
    [workspacesByOrg, navigate],
  )

  const setCurrentWorkspace = useCallback(
    (workspace: WorkspaceBriefWithOrg) => {
      navigate({
        to: '/dashboard/$organizationId/workspaces/$workspaceId',
        params: {
          organizationId: workspace.organizationId,
          workspaceId: workspace.id,
        },
      })
    },
    [navigate],
  )

  // Mutations
  const createWorkspaceMutation = useCreateWorkspaceMutation()

  const value: OrganizationContextType = {
    organizations,
    workspacesByOrg,
    currentOrganization,
    currentWorkspace,
    setCurrentOrganization,
    setCurrentWorkspace,
    isLoading,
    createWorkspaceMutation,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    )
  }
  return context
}
