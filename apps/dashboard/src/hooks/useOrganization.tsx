import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type {Organization} from '@/lib/api/organizations';
import type {WorkspaceBrief} from '@/lib/api/workspaces';
import {  listOrganizations } from '@/lib/api/organizations'
import {
  
  createWorkspace,
  listOrganizationWorkspaces
} from '@/lib/api/workspaces'
import { isAuthenticated } from '@/lib/api/client'

const ORG_QUERY_KEY = ['organizations'] as const
const WORKSPACE_STORAGE_KEY = 'ticka_last_workspace_per_org'

type WorkspaceMap = Record<string, string>

interface WorkspaceBriefWithOrg extends WorkspaceBrief {
  organizationId: string
}

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

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

function getLastWorkspaceMap(): WorkspaceMap {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveLastWorkspaceMap(map: WorkspaceMap): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(map))
}

function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ organizationId, name }: { organizationId: string; name: string }) =>
      createWorkspace(organizationId, { name }),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: [...ORG_QUERY_KEY, 'workspaces', organizationId],
      })
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEY })
    },
  })
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)

  const {
    data: organizations = [],
    isLoading: isLoadingOrganizations,
  } = useQuery({
    queryKey: ORG_QUERY_KEY,
    queryFn: listOrganizations,
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  })

  const enabledOrgIds = useMemo(
    () => organizations.filter((o) => o.is_active).map((o) => o.id),
    [organizations],
  )

  const { data: workspacesArrays = [] } = useQuery({
    queryKey: [...ORG_QUERY_KEY, 'workspaces', enabledOrgIds],
    queryFn: async () => {
      const results = await Promise.all(
        enabledOrgIds.map(async (orgId) => {
          const workspaces = await listOrganizationWorkspaces(orgId)
          return workspaces.map((w) => ({ ...w, organizationId: orgId }))
        }),
      )
      return results.flat()
    },
    enabled: enabledOrgIds.length > 0 && isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  })

  const workspacesByOrg = useMemo(() => {
    const map: Record<string, Array<WorkspaceBrief> | undefined> = {}
    for (const ws of workspacesArrays) {
      const existing = map[ws.organizationId]
      if (existing) {
        existing.push(ws)
      } else {
        map[ws.organizationId] = [ws]
      }
    }
    return map
  }, [workspacesArrays])

  const currentOrganization = useMemo(
    () => organizations.find((o) => o.id === currentOrganizationId) ?? null,
    [organizations, currentOrganizationId],
  )

  const currentWorkspace = useMemo(
    () =>
      workspacesArrays.find((w) => w.id === currentWorkspaceId && w.is_active) ?? null,
    [workspacesArrays, currentWorkspaceId],
  )

  useEffect(() => {
    if (isLoadingOrganizations || organizations.length === 0 || currentOrganizationId) return

    const lastWorkspaceMap = getLastWorkspaceMap()
    const lastOrgId = Object.keys(lastWorkspaceMap)[0]

    const targetOrg = lastOrgId
      ? organizations.find((o) => o.id === lastOrgId && o.is_active)
      : null

    const org = targetOrg ?? organizations.find((o) => o.is_active) ?? null

    if (org) {
      setCurrentOrganizationId(org.id)

      const lastWorkspaceId = lastWorkspaceMap[org.id]
      const orgWorkspaces = workspacesByOrg[org.id] ?? []
      const targetWorkspace = lastWorkspaceId
        ? orgWorkspaces.find((w) => w.id === lastWorkspaceId && w.is_active)
        : null

      const workspace = targetWorkspace ?? orgWorkspaces.find((w) => w.is_active) ?? null
      if (workspace) {
        setCurrentWorkspaceId(workspace.id)
      }
    }
  }, [isLoadingOrganizations, organizations, workspacesByOrg, currentOrganizationId])

  const setCurrentOrganization = useCallback(
    (org: Organization) => {
      setCurrentOrganizationId(org.id)

      const lastWorkspaceMap = getLastWorkspaceMap()
      const lastWorkspaceId = lastWorkspaceMap[org.id]
      const orgWorkspaces = workspacesByOrg[org.id] ?? []

      const targetWorkspace = lastWorkspaceId
        ? orgWorkspaces.find((w) => w.id === lastWorkspaceId && w.is_active)
        : null

      const workspace = targetWorkspace ?? orgWorkspaces.find((w) => w.is_active) ?? null
      if (workspace) {
        setCurrentWorkspaceId(workspace.id)
      } else {
        setCurrentWorkspaceId(null)
      }
    },
    [workspacesByOrg],
  )

  const setCurrentWorkspace = useCallback((workspace: WorkspaceBriefWithOrg) => {
    setCurrentOrganizationId(workspace.organizationId)
    setCurrentWorkspaceId(workspace.id)

    const lastWorkspaceMap = getLastWorkspaceMap()
    lastWorkspaceMap[workspace.organizationId] = workspace.id
    saveLastWorkspaceMap(lastWorkspaceMap)
  }, [])

  const createWorkspaceMutation = useCreateWorkspaceMutation()

  const value: OrganizationContextType = {
    organizations,
    workspacesByOrg,
    currentOrganization,
    currentWorkspace,
    setCurrentOrganization,
    setCurrentWorkspace,
    isLoading: isLoadingOrganizations,
    createWorkspaceMutation,
  }

  return (
    <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
