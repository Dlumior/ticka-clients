import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'
import { currentUserQueryOptions, useAcceptInvitation } from '@/features/auth/api/auth.api'

export const Route = createFileRoute('/invitations/accept')({
  validateSearch: z.object({
    token: z.string(),
  }),
  beforeLoad: ({ context, search }) => {
    const user = context.queryClient.getQueryData(currentUserQueryOptions.queryKey)
    if (!user) {
      const returnTo = `/invitations/accept?token=${search.token}`
      throw redirect({ to: '/login', search: { redirect: returnTo } })
    }
  },
  component: AcceptInvitationPage,
})

function AcceptInvitationPage() {
  const { token } = Route.useSearch()
  const router = useRouter()
  const accept = useAcceptInvitation()

  useEffect(() => {
    accept.mutate(token, {
      onSuccess: () => {
        router.invalidate()
        router.navigate({ to: '/' })
      },
    })
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {accept.isPending && (
          <>
            <div className="size-10 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm text-muted-foreground">Accepting invitation…</p>
          </>
        )}
        {accept.isError && (
          <>
            <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <span className="text-xl">!</span>
            </div>
            <p className="text-sm font-medium">Could not accept invitation</p>
            <p className="text-xs text-muted-foreground">{accept.error?.message}</p>
          </>
        )}
      </div>
    </div>
  )
}
