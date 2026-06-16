import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'
import { useVerifyEmail } from '@/features/auth/api/auth.api'

export const Route = createFileRoute('/verify-email')({
  validateSearch: z.object({
    token: z.string().uuid(),
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { token } = Route.useSearch()
  const router = useRouter()
  const verify = useVerifyEmail()

  useEffect(() => {
    verify.mutate(token, {
      onSuccess: () => {
        router.invalidate()
        setTimeout(() => router.navigate({ to: '/' }), 1200)
      },
    })
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {verify.isPending && (
          <>
            <div className="size-10 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm text-muted-foreground">Verifying your email…</p>
          </>
        )}
        {verify.isSuccess && (
          <>
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <span className="text-xl">✓</span>
            </div>
            <p className="text-sm font-medium">Email verified</p>
            <p className="text-xs text-muted-foreground">Redirecting…</p>
          </>
        )}
        {verify.isError && (
          <>
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <span className="text-xl">!</span>
            </div>
            <p className="text-sm font-medium">Could not verify email</p>
            <p className="text-xs text-muted-foreground">{verify.error?.message}</p>
          </>
        )}
      </div>
    </div>
  )
}
