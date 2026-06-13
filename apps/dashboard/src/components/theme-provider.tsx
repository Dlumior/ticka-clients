/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import {
  THEMES,
  DEFAULT_THEME_ID,
  getTheme,
  isThemeId,
  type ThemeId,
} from "@/lib/themes"

type Theme = ThemeId | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ThemeId
  setTheme: (theme: Theme) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function getSystemThemeId(isDark: boolean): ThemeId {
  return isDark ? DEFAULT_THEME_ID : "pacific"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const editableParent = target.closest(
    "input, textarea, select, [contenteditable='true']"
  )
  if (editableParent) {
    return true
  }

  return false
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME_ID,
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored === "system") return "system"
    if (isThemeId(stored)) return stored
    return defaultTheme
  })

  const [systemIsDark, setSystemIsDark] = React.useState(
    () => window.matchMedia(COLOR_SCHEME_QUERY).matches
  )

  const resolvedTheme = React.useMemo<ThemeId>(() => {
    if (theme === "system") return getSystemThemeId(systemIsDark)
    return theme
  }, [theme, systemIsDark])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const applyTheme = React.useCallback(
    (themeId: ThemeId) => {
      const root = document.documentElement
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      const allThemeClasses = THEMES.map((t) => t.cssClass)
      root.classList.remove(...allThemeClasses, "dark", "light")

      const themeDef = getTheme(themeId)
      root.classList.add(themeDef.cssClass)
      root.classList.add(themeDef.polarity)

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme, applyTheme])

  React.useEffect(() => {
    if (theme !== "system") return undefined

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditableTarget(event.target)) return
      if (event.key.toLowerCase() !== "d") return

      setThemeState((current) => {
        const ids = THEMES.map((t) => t.id)
        const currentId = current === "system" ? resolvedTheme : current
        const idx = ids.indexOf(currentId)
        const next = ids[(idx + 1) % ids.length]
        localStorage.setItem(storageKey, next)
        return next
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [storageKey, resolvedTheme])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return
      if (event.key !== storageKey) return

      if (event.newValue === "system") {
        setThemeState("system")
        return
      }
      if (isThemeId(event.newValue)) {
        setThemeState(event.newValue)
        return
      }
      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
