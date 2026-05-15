import { THEMES } from "@/lib/themes"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Select theme"
      className={cn(
        "flex items-center gap-1 rounded-lg border border-border bg-muted p-1",
        className
      )}
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={resolvedTheme === t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            resolvedTheme === t.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
