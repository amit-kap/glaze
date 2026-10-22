import type { StudioActions } from "../control-panel/actions"
import type { Custom, Defaults } from "../theme-builder"

export type Mode = "light" | "dark"

// Everything a tab needs: the theme's own values plus the sidebar's
// mutators. Built once by CustomizeSidebar and passed down as one prop.
export interface ThemeEditor {
  custom: Custom
  defaults: Defaults
  /** The mode the colour rows edit, resolved to light or dark. */
  mode: Mode
  /** Effective value of a colour input (custom override or theme default). */
  color: (m: Mode, key: string) => string
  /** Effective value of a shared (mode-independent) input, as raw CSS. */
  shared: (key: string) => string
  /** Effective value of a tier-2 token: the pin, or the derived value
      resolved under the live theme. */
  system: (m: Mode, key: string) => string
  /** True when the token is pinned, i.e. no longer follows its input. */
  systemOverridden: (m: Mode, key: string) => boolean
  setCustom: (update: (c: Custom) => Custom) => void
  setPx: (key: string, px: number) => void
  setNum: (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit?: string
  ) => void
  setColor: (m: Mode, key: string, hex: string) => void
  /** Pin a tier-2 token to a colour, or pass null to return it to the
      input's derivation. */
  setSystem: (m: Mode, key: string, hex: string | null) => void
  radius: number
  pill: boolean
  /** The draft-level actions: base, name, library, import, share. */
  actions: StudioActions
}
