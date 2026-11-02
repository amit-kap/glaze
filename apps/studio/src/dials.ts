// Dials: a few intents that generate many tokens. A dial only fills in colours
// the user has not taken over; the per-token edits stay the override.

import {
  formatColor,
  oklchToRgba,
  parseColor,
  rgbaToOklch,
} from "@amit-kap/glaze/lib/color"

import { defaults, tokens, type Color, type Mode } from "./theme"

/** The neutrals dial: a tint (hue in degrees) and how strongly it shows. */
export type NeutralsDial = { hue: number; strength: number }

export type Dials = { neutrals: NeutralsDial }

export const hues = { cool: 250, neutral: 0, warm: 70 } as const

export const dialDefaults: Dials = {
  neutrals: { hue: hues.warm, strength: 0 },
}

/** The surfaces, fills, borders and text a tint reaches. */
export const neutralTokens = [
  "background",
  "card",
  "overlay",
  "sidebar",
  "muted",
  "secondary",
  "accent",
  "border",
  "input",
  "foreground",
  "muted-foreground",
].filter((token) => tokens.includes(token))

// The most chroma a tint adds, at full strength. Neutrals read as tinted well
// before colour, so this stays small.
const maxChroma = 0.03

/** Mid lightness carries the tint; near white and near black carry little. */
const reach = (lightness: number) =>
  Math.min(1, Math.max(0.25, 1 - Math.abs(lightness - 55) / 60))

/**
 * One neutral as the dial makes it: Nova's lightness and opacity kept, the hue
 * set to the dial's and chroma added in proportion to strength. At strength 0
 * it is Nova's own value.
 */
export function neutralFor(
  mode: Mode,
  token: string,
  { hue, strength }: NeutralsDial
): Color {
  const base = defaults[mode][token]
  if (strength <= 0) return base
  const parsed = parseColor(base)
  if (!parsed) return base
  const { l, c } = rgbaToOklch(parsed)
  // oklchToRgba already clamps each channel to the sRGB gamut.
  return formatColor(
    oklchToRgba(l, c + strength * maxChroma * reach(l), hue, parsed.a),
    "oklch"
  )
}
