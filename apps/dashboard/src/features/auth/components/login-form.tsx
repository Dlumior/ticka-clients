import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button } from '@/components/ui/button'
import { useLogin } from '@/features/auth/api/auth.api'
import { zUserLoginInputRequest } from '@repo/api-types'

export function LoginForm() {
  const login = useLogin()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: zUserLoginInputRequest,
    },
    onSubmit: async ({ value }) => {
      login.mutate(value)
    },
  })

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-semibold">Sign in</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          {login.error && (
            <p className="text-sm text-destructive" role="alert">
              {login.error.message}
            </p>
          )}

          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Email
                </label>
                <input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Password
                </label>
                <input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting || login.isPending}
                className="mt-2 w-full"
              >
                {isSubmitting || login.isPending ? 'Signing in…' : 'Sign in'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}
