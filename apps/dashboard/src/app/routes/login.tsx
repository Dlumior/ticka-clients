import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/features/auth/components/login-form'
import { LocaleSwitcher } from '@/components/locale-switcher'
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
  return (
    <>
      <div className="fixed top-4 right-4 z-20">
        <LocaleSwitcher />
      </div>
      <LoginForm />
    </>
  )
}
