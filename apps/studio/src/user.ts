import * as React from "react"

// MOCK sign-in. Until Studio has a backend there is no account: signing in
// stores a name and an email in this browser and nothing else. No password is
// asked for and nothing is sent anywhere. The "own themes" Home shows once
// signed in are the ones the library already keeps in this same browser.

const userKey = "glaze-studio-user-v1"

export type User = { name: string; email: string }

function read(): User | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(userKey) ?? "null")
    return typeof parsed?.name === "string" && typeof parsed?.email === "string"
      ? { name: parsed.name, email: parsed.email }
      : null
  } catch {
    return null
  }
}

// One store for every component that asks, so the two top bars agree.
let current = read()
const listeners = new Set<() => void>()

function set(next: User | null) {
  current = next
  try {
    if (next) localStorage.setItem(userKey, JSON.stringify(next))
    else localStorage.removeItem(userKey)
  } catch {
    /* Storage can be unavailable; the sign-in lasts for this visit. */
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useUser() {
  const user = React.useSyncExternalStore(subscribe, () => current)
  return { user, signIn: set, signOut: () => set(null) }
}

/** Up to two letters from the name: "Amit Kaplinsky" is "AK". */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters =
    words.length > 1
      ? words[0][0] + words[words.length - 1][0]
      : (words[0] ?? "").slice(0, 2)
  return letters.toUpperCase()
}
