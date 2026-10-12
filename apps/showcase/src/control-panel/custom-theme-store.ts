import {
  emptyCustom,
  isBaseTheme,
  type BaseTheme,
  type Custom,
} from "../theme-builder"

// The custom theme is kept beside ThemeProvider's own storage, so a reload
// restores it. The key is versioned: earlier shapes are ignored.
const storageKey = "glaze-showcase-custom-v2"

export type CustomThemeState = { base: BaseTheme; custom: Custom }

export function loadCustomTheme(): CustomThemeState | null {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null")
    if (!stored || !isBaseTheme(stored.base)) return null
    return {
      base: stored.base,
      custom: { ...emptyCustom, ...stored.custom },
    }
  } catch {
    return null
  }
}

export function saveCustomTheme(value: CustomThemeState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // Storage blocked: the custom theme lasts for this visit only.
  }
}
