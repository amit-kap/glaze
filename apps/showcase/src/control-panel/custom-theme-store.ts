import {
  emptyCustom,
  isBaseTheme,
  type BaseTheme,
  type Custom,
} from "../theme-builder"

// The draft theme and the saved library are kept beside ThemeProvider's own
// storage, so a reload restores them. Keys are versioned: the draft migrates
// from the previous shape, anything older is ignored.
const draftKey = "glaze-showcase-custom-v3"
const draftKeyV2 = "glaze-showcase-custom-v2"
const libraryKey = "glaze-showcase-library-v1"

export type CustomThemeState = {
  base: BaseTheme
  custom: Custom
  /** The library entry the draft was loaded from, while it still has one. */
  savedId?: string
}

export type SavedTheme = {
  id: string
  base: BaseTheme
  custom: Custom
  savedAt: number
}

const read = (key: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null")
  } catch {
    return null
  }
}

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage blocked: the theme lasts for this visit only.
  }
}

/** V4 renamed the page colour input from "canvas" to "background". */
const renameCanvas = (
  values: Record<string, string> | undefined
): Record<string, string> | undefined => {
  if (!values || !("canvas" in values)) return values
  const { canvas, ...rest } = values
  return rest.background === undefined ? { ...rest, background: canvas } : rest
}

const toState = (stored: unknown): CustomThemeState | null => {
  if (!stored || typeof stored !== "object") return null
  const { base, custom, savedId } = stored as Record<string, unknown>
  if (typeof base !== "string" || !isBaseTheme(base)) return null
  const values = (custom as Partial<Custom> | undefined) ?? {}
  return {
    base,
    custom: {
      ...emptyCustom,
      ...values,
      light: renameCanvas(values.light) ?? {},
      dark: renameCanvas(values.dark) ?? {},
    },
    savedId: typeof savedId === "string" ? savedId : undefined,
  }
}

export function loadCustomTheme(): CustomThemeState | null {
  return toState(read(draftKey)) ?? toState(read(draftKeyV2))
}

export function saveCustomTheme(value: CustomThemeState) {
  write(draftKey, value)
}

export function loadLibrary(): SavedTheme[] {
  const stored = read(libraryKey)
  if (!Array.isArray(stored)) return []
  return stored.flatMap((entry): SavedTheme[] => {
    const state = toState(entry)
    const { id, savedAt } = (entry ?? {}) as Record<string, unknown>
    if (!state || typeof id !== "string") return []
    return [
      {
        id,
        base: state.base,
        custom: state.custom,
        savedAt: typeof savedAt === "number" ? savedAt : 0,
      },
    ]
  })
}

export function saveLibrary(list: SavedTheme[]) {
  write(libraryKey, list)
}

export const newId = () => crypto.randomUUID()
