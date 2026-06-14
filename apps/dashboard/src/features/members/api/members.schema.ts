import { z } from 'zod'
import { zWorkspaceMemberInviteInputRequest } from '@repo/api-types'

// The form always supplies a role (defaults to 'member'), so require it here —
// the generated schema marks it optional, which clashes with the form values.
export const zInviteMemberFormValues = zWorkspaceMemberInviteInputRequest.required({
  role: true,
})
export type InviteMemberFormValues = z.infer<typeof zInviteMemberFormValues>
