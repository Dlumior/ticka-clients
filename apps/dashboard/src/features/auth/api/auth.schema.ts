import { zUserLoginInputRequest } from '@repo/api-types'
import type { z } from 'zod'

export { zUserLoginInputRequest }
export type LoginFormValues = z.infer<typeof zUserLoginInputRequest>
