const KEY = 'ticka:last-active'

export interface LastActive {
  orgSlug?: string
  workspaceSlug?: string
}

function safeRead(): LastActive {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as LastActive
    return {
      orgSlug: typeof parsed.orgSlug === 'string' ? parsed.orgSlug : undefined,
      workspaceSlug:
        typeof parsed.workspaceSlug === 'string' ? parsed.workspaceSlug : undefined,
    }
  } catch {
    return {}
  }
}

function safeWrite(value: LastActive) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    // ignore quota / privacy errors
  }
}

export const lastActive = {
  read: safeRead,
  write(next: LastActive) {
    safeWrite({ ...safeRead(), ...next })
  },
}
