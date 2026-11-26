import * as React from "react"

import type { Stored } from "./draft"

const libraryKey = "glaze-studio-library-v1"
const sessionKey = "glaze-studio-session-v1"

export type SavedTheme = {
  id: string
  name: string
  savedAt: number
  data: Stored
  /** Set while the theme sits in the archive; absent otherwise. */
  archivedAt?: number
}

/** Which library entry the draft belongs to, and the name it carries. */
export type Session = { id: string | null; name: string }

function readLibrary(): SavedTheme[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(libraryKey) ?? "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function readSession(): Session {
  try {
    const parsed = JSON.parse(localStorage.getItem(sessionKey) ?? "null")
    return { id: parsed?.id ?? null, name: parsed?.name ?? "" }
  } catch {
    return { id: null, name: "" }
  }
}

export function writeSession(session: Session) {
  try {
    localStorage.setItem(sessionKey, JSON.stringify(session))
  } catch {
    /* Storage can be unavailable; the app works without it. */
  }
}

/**
 * The saved themes, newest first, and the archived ones, most recently
 * archived first. Saving under an id updates it in place. Archiving only marks
 * a theme, so `themes` (what the editor lists) never includes it.
 */
export function useLibrary() {
  const [all, setAll] = React.useState(readLibrary)
  // Two saves in one event (save the open theme, then add a new one) must
  // build on each other, so the latest list lives in a ref.
  const latest = React.useRef(all)

  const commit = React.useCallback((next: SavedTheme[]) => {
    latest.current = next
    setAll(next)
    try {
      localStorage.setItem(libraryKey, JSON.stringify(next))
    } catch {
      /* Storage can be unavailable; the list still works for this visit. */
    }
  }, [])

  const save = React.useCallback(
    (id: string | null, name: string, data: Stored) => {
      const entry: SavedTheme = {
        id: id ?? crypto.randomUUID(),
        name: name.trim() || "Untitled theme",
        savedAt: Date.now(),
        data,
      }
      commit([
        entry,
        ...latest.current.filter((theme) => theme.id !== entry.id),
      ])
      return entry
    },
    [commit]
  )

  const remove = React.useCallback(
    (id: string) => commit(latest.current.filter((theme) => theme.id !== id)),
    [commit]
  )

  const archive = React.useCallback(
    (id: string) =>
      commit(
        latest.current.map((theme) =>
          theme.id === id ? { ...theme, archivedAt: Date.now() } : theme
        )
      ),
    [commit]
  )

  const restore = React.useCallback(
    (id: string) =>
      commit(
        // Undefined drops out of the stored JSON, so the theme is plain again.
        latest.current.map((theme) =>
          theme.id === id ? { ...theme, archivedAt: undefined } : theme
        )
      ),
    [commit]
  )

  const themes = React.useMemo(
    () => all.filter((theme) => theme.archivedAt === undefined),
    [all]
  )
  const archived = React.useMemo(
    () =>
      all
        .filter((theme) => theme.archivedAt !== undefined)
        .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)),
    [all]
  )

  return { themes, archived, save, remove, archive, restore }
}

const templatesKey = "glaze-studio-archived-templates-v1"

function readArchivedTemplates(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(templatesKey) ?? "{}")
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * The built-in templates the user put away, by name, with when. A template is
 * part of Studio, so archiving only hides it; restoring brings it back.
 */
export function useArchivedTemplates() {
  const [archived, setArchived] = React.useState(readArchivedTemplates)

  const commit = React.useCallback(
    (change: (current: Record<string, number>) => Record<string, number>) =>
      setArchived((current) => {
        const next = change(current)
        try {
          localStorage.setItem(templatesKey, JSON.stringify(next))
        } catch {
          /* Storage can be unavailable; the change lasts for this visit. */
        }
        return next
      }),
    []
  )

  const archive = React.useCallback(
    (name: string) => commit((current) => ({ ...current, [name]: Date.now() })),
    [commit]
  )
  const restore = React.useCallback(
    (name: string) =>
      commit((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([key]) => key !== name)
        )
      ),
    [commit]
  )

  return { archived, archive, restore }
}

const minute = 60_000

/** "just now", "5m ago", "3h ago", "2d ago". */
export function age(savedAt: number) {
  const elapsed = Date.now() - savedAt
  if (elapsed < minute) return "just now"
  if (elapsed < 60 * minute) return `${Math.floor(elapsed / minute)}m ago`
  if (elapsed < 24 * 60 * minute)
    return `${Math.floor(elapsed / (60 * minute))}h ago`
  return `${Math.floor(elapsed / (24 * 60 * minute))}d ago`
}

/** How many settings differ between two values, counted leaf by leaf. */
export function countDiff(a: unknown, b: unknown): number {
  const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null
  if (!isObject(a) || !isObject(b))
    return JSON.stringify(a) === JSON.stringify(b) ? 0 : 1
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  let count = 0
  for (const key of keys) count += countDiff(a[key], b[key])
  return count
}
