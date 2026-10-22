import type { BaseTheme } from "../theme-builder"
import type { SavedTheme } from "./custom-theme-store"

// Everything the Customize panel can do to the draft besides editing its
// inputs: switch base, name it, keep it in the library, import and share.
// Built by ControlPanel and passed down as one prop, so the header, library
// dialog and tabs can be written against this type alone.
export type StudioActions = {
  base: BaseTheme
  /** Switches the base theme: clears the overrides (keeping the name) and
      detaches the draft from any library entry. */
  setBase: (base: BaseTheme) => void
  setName: (name: string) => void
  /** Drops every override, keeping the name. */
  reset: () => void
  changeCount: number
  library: SavedTheme[]
  /** The library entry the draft was loaded from, while it still has one. */
  savedId?: string
  /** Saves the draft: a new entry when `asNew` or the draft has no entry,
      otherwise the entry it came from is updated in place. */
  saveToLibrary: (asNew?: boolean) => void
  loadFromLibrary: (id: string) => void
  deleteFromLibrary: (id: string) => void
  renameInLibrary: (id: string, name: string) => void
  /** Loads a theme from a glaze.config.json or a generated theme CSS file.
      Returns the problem to show, or null once loaded. */
  importConfig: (text: string) => string | null
  /** A link that opens the showcase with this draft; "" when nothing has
      been customized. */
  shareUrl: string
}
