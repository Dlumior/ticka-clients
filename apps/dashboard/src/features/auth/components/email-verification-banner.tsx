import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth.context'
import { useResendVerification } from '@/features/auth/api/auth.api'

export function EmailVerificationBanner() {
  const { user } = useAuth()
  const resend = useResendVerification()

  if (!user || user.email_verified) return null

  return (
    <div className="border-b border-border bg-card px-4 py-2.5">
      <Alert className="border-0 bg-transparent px-0 py-0">
        <AlertDescription className="text-foreground">
          Verify your email address ({user.email}) to secure your account. We sent
          you a link when you signed up.
        </AlertDescription>
        <AlertAction className="static">
          <Button
            size="sm"
            variant="outline"
            disabled={resend.isPending || resend.isSuccess}
            onClick={() => resend.mutate()}
          >
            {resend.isSuccess ? 'Sent ✓' : resend.isPending ? 'Sending…' : 'Resend email'}
          </Button>
        </AlertAction>
      </Alert>
    </div>
  )
}
