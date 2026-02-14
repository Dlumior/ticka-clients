import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface Workspace {
  id: string
  name: string
  slug: string
  logo?: string
}

interface WorkspaceContextType {
  workspaces: Array<Workspace>
  currentWorkspace: Workspace | null
  setCurrentWorkspace: (workspace: Workspace) => void
  isLoading: boolean
}

const mockWorkspaces: Array<Workspace> = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    slug: 'techstart',
  },
  {
    id: '3',
    name: 'Design Studio',
    slug: 'design-studio',
  },
]

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces] = useState<Array<Workspace>>(mockWorkspaces)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  )
  const [isLoading] = useState(false)

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
