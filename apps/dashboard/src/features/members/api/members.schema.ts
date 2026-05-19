import { z } from 'zod'
import { zWorkspaceMemberInviteInputRequest } from '@repo/api-types'

export const zInviteMemberFormValues = zWorkspaceMemberInviteInputRequest
export type InviteMemberFormValues = z.infer<typeof zInviteMemberFormValues>
