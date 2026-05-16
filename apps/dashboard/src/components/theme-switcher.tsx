"use client"

import { THEMES } from "@/lib/themes"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  RiMoonLine,
  RiSunLine,
  RiCheckLine,
  RiArrowDownSLine,
} from "@remixicon/react"

import type { ThemeDefinition } from "@/lib/themes"

function PolarityIcon({ theme }: { theme: ThemeDefinition }) {
  return theme.polarity === "dark"
    ? <RiMoonLine />
    : <RiSunLine />
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const currentTheme = THEMES.find((t) => t.id === resolvedTheme) ?? THEMES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium transition-colors",
          "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
      >
        <PolarityIcon theme={currentTheme} />
        <span className="text-foreground">{currentTheme.label}</span>
        <RiArrowDownSLine className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[popup-open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
          >
            <PolarityIcon theme={t} />
            <span className="flex-1">{t.label}</span>
            {resolvedTheme === t.id && (
              <RiCheckLine className="ml-auto text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
