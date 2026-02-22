export const orgKeys = {
  all: ['organizations'] as const,
  workspaces: (orgIds: Array<string>) =>
    [...orgKeys.all, 'workspaces', orgIds] as const,
  workspace: (orgId: string) => [...orgKeys.all, 'workspaces', orgId] as const,
}
