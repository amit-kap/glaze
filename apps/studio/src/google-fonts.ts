// Google Fonts for the Typography section. The list comes from Fontsource's
// public catalog (no key, CORS open); a chosen font loads from Google's own
// CSS, which is also what the exported theme links to. The six bundled faces
// stay as they are: they work offline and need no link.

import * as React from "react"

export type GoogleFont = {
  family: string
  weights: number[]
  category: string
}

const listUrl = "https://api.fontsource.org/v1/fonts?type=google"
const cacheKey = "glaze-studio-google-fonts-v1"
const cacheDays = 7

/** The weights Studio asks for: the range the Tone slider moves through. */
export const wantedWeights = [400, 500, 600, 700]

const generic: Record<string, string> = {
  "sans-serif": "sans-serif",
  serif: "serif",
  monospace: "monospace",
  handwriting: "cursive",
  display: "sans-serif",
}

/** A font as a CSS family stack. */
export const fontStack = (font: GoogleFont) =>
  `"${font.family}", ${generic[font.category] ?? "sans-serif"}`

/** The weights of a font that Studio will use, nearest to the ones it wants. */
export function usableWeights(available: number[]): number[] {
  const picked = new Set(
    wantedWeights.map((wanted) =>
      available.reduce((best, weight) =>
        Math.abs(weight - wanted) < Math.abs(best - wanted) ? weight : best
      )
    )
  )
  return [...picked].sort((a, b) => a - b)
}

/** Google's CSS for a family at the given weights. */
export const fontCssUrl = (family: string, weights: number[]) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@${weights.join(";")}&display=swap`

/**
 * The Google family named by a stack, or null for the bundled faces (which
 * are written "Family Variable") and for system stacks.
 */
export function googleFamilyOf(css: string | undefined): string | null {
  const match = css?.trim().match(/^"([^"]+)"/)
  if (!match || match[1].endsWith(" Variable")) return null
  return match[1]
}

// --- The list ----------------------------------------------------------------

function readCache(): GoogleFont[] | null {
  try {
    const stored = JSON.parse(localStorage.getItem(cacheKey) ?? "null") as {
      at: number
      fonts: GoogleFont[]
    } | null
    if (!stored || Date.now() - stored.at > cacheDays * 864e5) return null
    return stored.fonts
  } catch {
    return null
  }
}

async function fetchList(): Promise<GoogleFont[]> {
  const response = await fetch(listUrl)
  if (!response.ok) throw new Error(`Fontsource answered ${response.status}`)
  const raw = (await response.json()) as {
    family: string
    weights: number[]
    category: string
  }[]
  const fonts = raw
    .filter((font) => font.category !== "icons" && font.weights.length > 0)
    .map(({ family, weights, category }) => ({ family, weights, category }))
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), fonts }))
  } catch {
    /* Storage can be full or blocked; the list still works this session. */
  }
  return fonts
}

type ListState = {
  fonts: GoogleFont[]
  status: "idle" | "loading" | "ready" | "error"
}

/**
 * The Google Fonts list. It is fetched the first time `wanted` turns true (the
 * search box is used), then kept in storage for a week.
 */
export function useGoogleFonts(wanted: boolean): ListState {
  const [state, setState] = React.useState<ListState>(() => {
    const cached = readCache()
    return cached
      ? { fonts: cached, status: "ready" }
      : { fonts: [], status: "idle" }
  })

  React.useEffect(() => {
    if (!wanted || state.status !== "idle") return
    let live = true
    fetchList().then(
      (fonts) => live && setState({ fonts, status: "ready" }),
      () => live && setState({ fonts: [], status: "error" })
    )
    return () => {
      live = false
    }
  }, [wanted, state.status])

  // Until the answer is in, a wanted list is loading.
  return state.status === "idle" && wanted
    ? { ...state, status: "loading" }
    : state
}

// --- Loading a font ----------------------------------------------------------

/** Link a Google family into the page, once, so the preview can use it. */
export function useFontLink(family: string | null, weights: number[] | null) {
  const url = family ? fontCssUrl(family, weights ?? wantedWeights) : null
  React.useEffect(() => {
    if (!url) return
    const id = `glaze-font-${url}`
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = url
    document.head.appendChild(link)
  }, [url])
}
