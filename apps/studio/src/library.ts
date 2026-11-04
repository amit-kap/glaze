import * as React from "react"

import type { Stored } from "./draft"

const libraryKey = "glaze-studio-library-v1"
const sessionKey = "glaze-studio-session-v1"

export type SavedTheme = {
  id: string
  name: string
  savedAt: number
  data: Stored
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

/** The saved themes, newest first. Saving under an id updates it in place. */
export function useLibrary() {
  const [themes, setThemes] = React.useState(readLibrary)
  // Two saves in one event (save the open theme, then add a new one) must
  // build on each other, so the latest list lives in a ref.
  const latest = React.useRef(themes)

  const commit = React.useCallback((next: SavedTheme[]) => {
    latest.current = next
    setThemes(next)
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

  return { themes, save, remove }
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
