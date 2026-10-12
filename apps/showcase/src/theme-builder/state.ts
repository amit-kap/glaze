import { readThemeCss } from "@amit-kap/glaze/lib/generate"

import { baseCss, type BaseTheme } from "./base-themes"
import { colorKeys, fonts, headingFonts, monoFonts, sharedKeys } from "./inputs"

/** What the user changed; anything left out shows the theme's own value. */
export type Custom = {
  name: string
  /** Colour inputs by mode, as hex (8 digits when translucent). */
  light: Record<string, string>
  dark: Record<string, string>
  /** Every other input, as the CSS value it is written with. */
  shared: Record<string, string>
  controls?: string
  font?: string
  headingFont?: string
  monoFont?: string
  /** False turns the fades off. */
  fades?: boolean
  /** Brand ink follows the brand colour until it is edited by hand. */
  inkAuto?: boolean
}

export const emptyCustom: Custom = {
  name: "my-theme",
  light: {},
  dark: {},
  shared: {},
}

export const isCustomized = (c: Custom) =>
  Object.keys(c.light).length > 0 ||
  Object.keys(c.dark).length > 0 ||
  Object.keys(c.shared).length > 0 ||
  (["controls", "font", "headingFont", "monoFont", "fades"] as const).some(
    (k) => c[k] !== undefined
  )

/** A theme's own values: raw CSS by input name, with Nova filling the gaps. */
export type Defaults = {
  light: Record<string, string>
  dark: Record<string, string>
  shared: Record<string, string>
  controls: string
  font: string
  headingFont: string
  monoFont: string
}

export function themeDefaults(base: BaseTheme): Defaults {
  const n = readThemeCss(baseCss.nova)
  const t = readThemeCss(baseCss[base])
  const get = (mode: "light" | "dark", key: string) =>
    t[mode].get(`--${key}`) ?? n[mode].get(`--${key}`) ?? ""
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  for (const key of colorKeys) {
    light[key] = get("light", key)
    dark[key] = get("dark", key)
  }
  const shared: Record<string, string> = {}
  for (const key of sharedKeys) shared[key] = get("light", key)
  const family = (key: string) => shared[key].trim()
  return {
    light,
    dark,
    shared,
    controls: shared["shape-control"] === "9999px" ? "pill" : "radius",
    font:
      fonts.find((f) => f.family === family("typeface-sans"))?.value ?? "geist",
    headingFont:
      headingFonts.find(
        (f) => "family" in f && f.family === family("typeface-heading")
      )?.value ?? "same",
    monoFont:
      monoFonts.find((f) => f.family === family("typeface-mono"))?.value ??
      "system",
  }
}
