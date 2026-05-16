import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/features/auth/components/login-form'
import { currentUserQueryOptions } from '@/features/auth/api/auth.api'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    const user = context.queryClient.getQueryData(currentUserQueryOptions.queryKey)
    if (user) {
      throw redirect({ to: search.redirect ?? '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return <LoginForm />
}
