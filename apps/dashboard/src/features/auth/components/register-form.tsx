import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "@tanstack/react-form"
import { Link, useRouter } from "@tanstack/react-router"
import { useRegister, useAcceptInvitation } from "@/features/auth/api/auth.api"
import { zUserRegisterInputRequest } from "@repo/api-types"

function ParticlesCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ""
    const colors = ["bg-primary", "bg-accent", "bg-white"]
    for (let i = 0; i < 50; i++) {
      const spark = document.createElement("div")
      const sizeClass =
        Math.random() < 0.6
          ? "w-0.5 h-0.5"
          : Math.random() < 0.9
            ? "w-1 h-1"
            : "w-1.5 h-1.5"
      const color = colors[Math.floor(Math.random() * colors.length)]
      const tx = (Math.random() - 0.5) * 200
      const ty = (Math.random() - 0.5) * 150
      const duration = 3 + Math.random() * 5
      const delay = Math.random() * -5
      const opacity = 0.3 + Math.random() * 0.5
      spark.className = `absolute rounded-full opacity-0 ${sizeClass} ${color}`
      spark.style.left = `${Math.random() * 100}%`
      spark.style.top = `${Math.random() * 100}%`
      spark.style.setProperty("--tx", `${tx}px`)
      spark.style.setProperty("--ty", `${ty}px`)
      spark.style.setProperty("--target-opacity", `${opacity}`)
      spark.style.animation = `ticka-spark ${duration}s cubic-bezier(0.4,0,0.2,1) ${delay}s infinite`
      container.appendChild(spark)
    }
  }, [])
  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  )
}

const PASSWORD_REQUIREMENT_TESTS: { key: string; test: (v: string) => boolean }[] = [
  { key: "minLength", test: (v: string) => v.length >= 8 },
  { key: "uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { key: "number", test: (v: string) => /[0-9]/.test(v) },
  { key: "special", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message)
  }
  return String(error)
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const { t } = useTranslation("auth")
  const met = PASSWORD_REQUIREMENT_TESTS.filter((r) => r.test(password)).length
  if (!password) return null

  const strengthColor =
    met <= 1
      ? "bg-destructive"
      : met === 2
        ? "bg-orange-500"
        : met === 3
          ? "bg-yellow-500"
          : "bg-emerald-500"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strengthLabel = met <= 1 ? t("passwordStrength.weak") : met === 2 ? t("passwordStrength.fair") : met === 3 ? t("passwordStrength.good") : t("passwordStrength.strong")

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
            style={{ width: `${(met / 4) * 100}%` }}
          />
        </div>
        <span className="min-w-[36px] text-right text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {strengthLabel}
        </span>
      </div>

      {/* Requirements grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {PASSWORD_REQUIREMENT_TESTS.map((req) => {
          const passed = req.test(password)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const label = t(`passwordStrength.${req.key}` as any)
          return (
            <div key={req.key} className="flex items-center gap-1.5">
              <span
                className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-[9px] transition-all duration-300 ${
                  passed
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted text-muted-foreground/40"
                }`}
              >
                {passed ? "✓" : "·"}
              </span>
              <span
                className={`text-[11px] transition-colors duration-300 ${
                  passed ? "text-emerald-500" : "text-muted-foreground/60"
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-border bg-input/50 px-3.5 py-2.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:bg-input/80 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"

const labelCls =
  "text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase"

const fieldErrorCls = "mt-1 text-[11px] text-destructive"

interface RegisterFormProps {
  invitationToken?: string
  prefillEmail?: string
}

export function RegisterForm({
  invitationToken,
  prefillEmail,
}: RegisterFormProps) {
  const { t } = useTranslation("auth")
  const register = useRegister()
  const acceptInvitation = useAcceptInvitation()
  const router = useRouter()
  const [passwordValue, setPasswordValue] = useState("")

  const form = useForm({
    defaultValues: {
      email: prefillEmail ?? "",
      password: "",
      password_confirm: "",
      first_name: "",
      last_name: "",
    },
    validators: { onSubmit: zUserRegisterInputRequest },
    onSubmit: async ({ value }) => {
      await register.mutateAsync(value)
      if (invitationToken) {
        await acceptInvitation.mutateAsync(invitationToken)
      }
      router.invalidate()
    },
  })

  const isPending = register.isPending || acceptInvitation.isPending
  const error = register.error ?? acceptInvitation.error

  return (
    <>
      <style>{`
        @keyframes ticka-spark {
          0%   { opacity: 0; transform: translate(0,0) scale(0); }
          15%  { opacity: var(--target-opacity,0.8); transform: translate(calc(var(--tx)*0.2),calc(var(--ty)*0.2)) scale(1); }
          80%  { opacity: var(--target-opacity,0.4); }
          100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0); }
        }
        @keyframes ticka-pulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.08); }
        }
        @keyframes ticka-fadeup {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ticka-card { animation: ticka-fadeup 0.45s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="ledger-lines relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8">
        {/* Ambient blobs */}
        <div
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary blur-3xl"
          style={{ animation: "ticka-pulse 7s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent blur-3xl"
          style={{ animation: "ticka-pulse 7s ease-in-out 2.5s infinite" }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[420px] w-[420px] rounded-full bg-primary opacity-[0.05] blur-3xl" />
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <ParticlesCanvas />

        <div className="ticka-card relative z-10 w-full max-w-[400px]">
          <div
            className="rounded-2xl border border-border/60 bg-card/50 p-7 shadow-2xl"
            style={{ backdropFilter: "blur(24px)" }}
          >
            {/* Header */}
            <div className="mb-6 flex flex-col items-center gap-2.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] border border-primary/25 bg-primary/10">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="currentColor"
                  />
                </svg>
                {/* Ping dot */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
              </div>

              <h1 className="font-heading text-3xl font-medium tracking-tight italic">
                Ticka<span className="text-primary">.</span>
              </h1>

              <p className="text-xs text-muted-foreground/70">
                {invitationToken
                  ? t("register.titleInvite")
                  : t("register.title")}
              </p>
            </div>

            {/* Invitation banner */}
            {invitationToken && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 flex-shrink-0 text-primary"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-[11px] leading-relaxed text-primary/80">
                  {t("register.inviteBanner")}
                </p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="flex flex-col gap-3.5"
            >
              {/* API error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-3.5 py-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 flex-shrink-0 text-destructive"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p
                    className="text-[11px] leading-relaxed text-destructive"
                    role="alert"
                  >
                    {error.message}
                  </p>
                </div>
              )}

              {/* Name row — uses grid to prevent overflow */}
              <div
                className="grid grid-cols-2 gap-3"
                style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}
              >
                <form.Field name="first_name">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name} className={labelCls}>
                        {t("register.firstName")}
                      </label>
                      <input
                        id={field.name}
                        type="text"
                        autoComplete="given-name"
                        placeholder="Alice"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={inputCls}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className={fieldErrorCls}>
                          {getErrorMessage(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="last_name">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name} className={labelCls}>
                        {t("register.lastName")}
                      </label>
                      <input
                        id={field.name}
                        type="text"
                        autoComplete="family-name"
                        placeholder="Johnson"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={inputCls}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className={fieldErrorCls}>
                          {getErrorMessage(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name} className={labelCls}>
                      {t("email")}
                    </label>
                    <input
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder={t("emailPlaceholder")}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!!prefillEmail}
                      className={inputCls}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className={fieldErrorCls}>
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Password */}
              <form.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name} className={labelCls}>
                      {t("password")}
                    </label>
                    <input
                      id={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setPasswordValue(e.target.value)
                      }}
                      className={inputCls}
                    />
                    {/* Live requirements — shown when user starts typing */}
                    <PasswordStrengthIndicator password={passwordValue} />
                    {field.state.meta.errors.length > 0 && (
                      <p className={fieldErrorCls}>
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Confirm password */}
              <form.Field
                name="password_confirm"
                validators={{
                  onChangeListenTo: ["password"],
                  onChange: ({ value, fieldApi }) =>
                    value !== fieldApi.form.getFieldValue("password")
                      ? t("passwordsDoNotMatch")
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name} className={labelCls}>
                      {t("register.confirmPassword")}
                    </label>
                    <div className="relative">
                      <input
                        id={field.name}
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={inputCls}
                      />
                      {/* Match indicator */}
                      {field.state.value && (
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                          {field.state.meta.errors.length === 0 ? (
                            <span className="text-emerald-500">✓</span>
                          ) : (
                            <span className="text-destructive">✗</span>
                          )}
                        </span>
                      )}
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className={fieldErrorCls}>
                        {/* errors can be strings (from onChange) or ZodIssue objects (from onSubmit) */}
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Divider */}
              <div className="my-0.5 border-t border-border/40" />

              {/* Submit */}
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="group relative w-full overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_0_28px_-6px_var(--color-primary)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                    }}
                  >
                    {/* Shine sweep */}
                    <span className="absolute inset-0 translate-x-[-110%] skew-x-[-20deg] bg-white/15 transition-transform duration-500 group-hover:translate-x-[110%]" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting || isPending ? (
                        <>
                          <svg
                            className="h-3.5 w-3.5 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          {t("register.submitting")}
                        </>
                      ) : invitationToken ? (
                        t("register.submitInvite")
                      ) : (
                        t("register.submit")
                      )}
                    </span>
                  </button>
                )}
              </form.Subscribe>
            </form>

            {/* Footer */}
            <p className="mt-5 text-center text-[11px] text-muted-foreground/50">
              {t("register.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="font-medium text-primary/70 underline-offset-2 transition-colors hover:text-primary hover:underline"
              >
                {t("register.signIn")}
              </Link>
            </p>
          </div>

          {/* Legal fine print */}
          <p className="mt-3 text-center text-[10px] text-muted-foreground/30">
            {t("register.legalIntro")}{" "}
            <a
              href="/terms"
              className="underline underline-offset-2 hover:text-muted-foreground/50"
            >
              {t("register.terms")}
            </a>{" "}
            &{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-muted-foreground/50"
            >
              {t("register.privacy")}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
