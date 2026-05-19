import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { RegisterForm } from '@/features/auth/components/register-form'
import { currentUserQueryOptions } from '@/features/auth/api/auth.api'

export const Route = createFileRoute('/register')({
  validateSearch: z.object({
    invitation_token: z.string().optional(),
    email: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    const user = context.queryClient.getQueryData(currentUserQueryOptions.queryKey)
    if (user) {
      throw redirect({ to: search.invitation_token ? '/' : '/' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { invitation_token, email } = Route.useSearch()
  return <RegisterForm invitationToken={invitation_token} prefillEmail={email} />
}
