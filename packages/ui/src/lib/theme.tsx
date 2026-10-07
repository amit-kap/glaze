"use client"

import * as React from "react"

// Applies the three Glaze switches (theme, mode, density) to <html> and
// remembers the viewer's choice. Spec: "Switches".

export type Mode = "light" | "dark" | "system"
export type Density = "comfortable" | "compact"

type Settings = { theme: string; mode: Mode; density: Density }

type ThemeContextValue = Settings & {
  /** The mode actually shown: "system" resolved to light or dark. */
  resolvedMode: "light" | "dark"
  setTheme: (theme: string) => void
  setMode: (mode: Mode) => void
  setDensity: (density: Density) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const darkQuery = "(prefers-color-scheme: dark)"

function read(storageKey: string): Partial<Settings> {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}")
  } catch {
    return {}
  }
}

function write(storageKey: string, settings: Settings) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings))
  } catch {
    // Storage blocked (private window, disabled site data): keep in memory.
  }
}

function apply(root: HTMLElement, settings: Settings, dark: boolean) {
  root.setAttribute("data-theme", settings.theme)
  root.classList.toggle("dark", dark)
  if (settings.density === "compact") root.setAttribute("data-density", "compact")
  else root.removeAttribute("data-density")
}

export type ThemeProviderProps = {
  children: React.ReactNode
  /** Theme name: "nova" (built in) or a `themes/<name>.css` you import. */
  defaultTheme?: string
  defaultMode?: Mode
  defaultDensity?: Density
  /** localStorage key for the viewer's choice; `false` to not persist. */
  storageKey?: string | false
}

export function ThemeProvider({
  children,
  defaultTheme = "nova",
  defaultMode = "system",
  defaultDensity = "comfortable",
  storageKey = "glaze",
}: ThemeProviderProps) {
  const [settings, setSettings] = React.useState<Settings>(() => ({
    theme: defaultTheme,
    mode: defaultMode,
    density: defaultDensity,
    ...(storageKey && typeof window !== "undefined" ? read(storageKey) : {}),
  }))
  const [systemDark, setSystemDark] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(darkQuery).matches
  )

  React.useEffect(() => {
    const query = window.matchMedia(darkQuery)
    const onChange = () => setSystemDark(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const resolvedMode =
    settings.mode === "system" ? (systemDark ? "dark" : "light") : settings.mode

  React.useLayoutEffect(() => {
    apply(document.documentElement, settings, resolvedMode === "dark")
    if (storageKey) write(storageKey, settings)
  }, [settings, resolvedMode, storageKey])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      ...settings,
      resolvedMode,
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setMode: (mode) => setSettings((s) => ({ ...s, mode })),
      setDensity: (density) => setSettings((s) => ({ ...s, density })),
    }),
    [settings, resolvedMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>")
  return context
}

/**
 * Inline script for <head> that applies the saved switches before the page
 * paints, so a dark or themed page doesn't flash the default first.
 * Pass the same defaults and storageKey as the ThemeProvider.
 */
export function themeScript({
  defaultTheme = "nova",
  defaultMode = "system",
  defaultDensity = "comfortable",
  storageKey = "glaze",
}: Omit<ThemeProviderProps, "children"> = {}) {
  const defaults = JSON.stringify({ theme: defaultTheme, mode: defaultMode, density: defaultDensity })
  const key = JSON.stringify(storageKey || "")
  return `(function(){try{var s=${defaults},k=${key};if(k){var v=JSON.parse(localStorage.getItem(k)||"{}");for(var p in v)s[p]=v[p]}var r=document.documentElement;r.setAttribute("data-theme",s.theme);var d=s.mode==="dark"||(s.mode==="system"&&matchMedia("${darkQuery}").matches);r.classList.toggle("dark",d);if(s.density==="compact")r.setAttribute("data-density","compact")}catch(e){}})()`
}
