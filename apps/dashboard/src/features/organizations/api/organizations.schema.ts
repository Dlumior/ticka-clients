import { zOrganizationCreateInputRequest } from '@repo/api-types'
import { z } from 'zod'

export const zCreateOrganizationForm = zOrganizationCreateInputRequest.extend({
  identifier: z.string().min(2).max(4),
})

export type CreateOrganizationFormValues = z.infer<typeof zCreateOrganizationForm>
