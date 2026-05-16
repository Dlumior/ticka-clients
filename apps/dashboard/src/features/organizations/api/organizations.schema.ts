import { zOrganizationCreateInputRequest } from '@repo/api-types'
import type { z } from 'zod'

export { zOrganizationCreateInputRequest }
export type CreateOrganizationFormValues = z.infer<typeof zOrganizationCreateInputRequest>
