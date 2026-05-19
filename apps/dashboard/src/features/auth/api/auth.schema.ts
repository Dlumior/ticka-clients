import { zUserLoginInputRequest, zUserRegisterInputRequest } from '@repo/api-types'
import type { z } from 'zod'

export { zUserLoginInputRequest }
export type LoginFormValues = z.infer<typeof zUserLoginInputRequest>

export { zUserRegisterInputRequest }
export type RegisterFormValues = z.infer<typeof zUserRegisterInputRequest>
