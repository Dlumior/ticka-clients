import { useEffect, useRef } from "react"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useLogin } from "@/features/auth/api/auth.api"
import { zUserLoginInputRequest } from "@repo/api-types"

function ParticlesCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ""

    const colors = ["bg-primary", "bg-accent", "bg-white"]
    for (let i = 0; i < 60; i++) {
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
      const opacity = 0.4 + Math.random() * 0.6

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

export function LoginForm() {
  const login = useLogin()
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validatorAdapter: zodValidator(),
    validators: { onSubmit: zUserLoginInputRequest },
    onSubmit: async ({ value }) => {
      login.mutate(value)
    },
  })

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes ticka-spark {
          0%   { opacity: 0; transform: translate(0,0) scale(0); }
          15%  { opacity: var(--target-opacity,0.8); transform: translate(calc(var(--tx)*0.2),calc(var(--ty)*0.2)) scale(1); }
          80%  { opacity: var(--target-opacity,0.4); }
          100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0); }
        }
        @keyframes ticka-pulse {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.35; }
        }
        @keyframes ticka-gradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
        {/* ── Atmospheric glows ── */}
        <div
          className="absolute top-[-80px] left-[-80px] h-96 w-96 rounded-full bg-primary blur-3xl"
          style={{
            opacity: 0.15,
            animation: "ticka-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[-80px] bottom-[-80px] h-80 w-80 rounded-full bg-accent blur-3xl"
          style={{
            opacity: 0.15,
            animation: "ticka-pulse 6s ease-in-out 2s infinite",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[500px] w-[500px] rounded-full bg-primary blur-3xl"
            style={{ opacity: 0.06 }}
          />
        </div>

        {/* ── Grid overlay ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary)/3% 1px,transparent 1px),linear-gradient(90deg,var(--color-primary)/3% 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* ── Particles ── */}
        <ParticlesCanvas />

        {/* ── Card ── */}
        <div className="relative z-10 w-full max-w-sm">
          <div
            className="rounded-3xl border border-border bg-card/40 p-8 shadow-2xl"
            style={{ backdropFilter: "blur(20px)" }}
          >
            {/* Logo mark */}
            <div className="mb-8 flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div>
                <h1
                  className="text-center text-2xl font-bold tracking-wide"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--color-primary),var(--color-accent),var(--color-primary))",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "ticka-gradient 4s linear infinite",
                  }}
                >
                  TICKA
                </h1>
                <p className="mt-0.5 text-center text-xs tracking-wider text-muted-foreground uppercase">
                  Contabilidad Inteligente
                </p>
              </div>
            </div>

            <p className="mb-6 text-center text-sm text-muted-foreground">
              Inicia sesión en tu cuenta
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="flex flex-col gap-5"
            >
              {login.error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <p className="text-xs text-destructive" role="alert">
                    {login.error.message}
                  </p>
                </div>
              )}

              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                    >
                      Email
                    </label>
                    <input
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="tu@empresa.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="rounded-xl border border-border bg-input/60 px-4 py-2.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={field.name}
                      className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                    >
                      Contraseña
                    </label>
                    <input
                      id={field.name}
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="rounded-xl border border-border bg-input/60 px-4 py-2.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
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
                  <button
                    type="submit"
                    disabled={isSubmitting || login.isPending}
                    className="group relative mt-1 w-full overflow-hidden rounded-xl px-8 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_var(--color-primary)] disabled:opacity-60 disabled:hover:scale-100"
                    style={{
                      background:
                        "linear-gradient(135deg,var(--color-primary),var(--color-accent))",
                    }}
                  >
                    <span className="relative z-10">
                      {isSubmitting || login.isPending
                        ? "Iniciando sesión…"
                        : "Iniciar sesión"}
                    </span>
                    <div className="absolute inset-0 origin-left scale-x-0 bg-white/20 transition-transform duration-300 group-hover:scale-x-100" />
                  </button>
                )}
              </form.Subscribe>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-muted-foreground/60">
              De tu correo a tus cuentas en segundos. ⚡
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
