import { zOrganizationWorkspaceCreateInputRequest } from '@repo/api-types'
import type { z } from 'zod'

export { zOrganizationWorkspaceCreateInputRequest }
export type CreateWorkspaceFormValues = z.infer<typeof zOrganizationWorkspaceCreateInputRequest>
