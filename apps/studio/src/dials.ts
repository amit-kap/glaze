// Dials: a few intents that generate many tokens. A dial only fills in colours
// the user has not taken over; the per-token edits stay the override.

import {
  formatColor,
  oklchToRgba,
  parseColor,
  rgbaToOklch,
} from "@amit-kap/glaze/lib/color"

import { motionDefaults, msToCss, toMs } from "./motion"
import { defaults, tokens, type Color, type Mode } from "./theme"

/** The neutrals dial: a tint (hue in degrees) and how strongly it shows. */
export type NeutralsDial = { hue: number; strength: number }

/** How much character the motion has: Nova's own, calmer, or springier. */
export type MotionDial = "none" | "subtle" | "edgy"

/** Quiet to bold, -1 to 1; 0 is Nova. */
export type Dials = { neutrals: NeutralsDial; tone: number; motion: MotionDial }

export const hues = { cool: 250, neutral: 0, warm: 70 } as const

export const dialDefaults: Dials = {
  neutrals: { hue: hues.warm, strength: 0 },
  tone: 0,
  motion: "none",
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

// --- Tone: one slider from quiet to bold ------------------------------------
// Bold means firmer lines, stronger secondary text and heavier, larger type;
// quiet is the reverse. The middle is Nova. Brand is left alone: it is the
// user's own pick, and a slider that recoloured it would undo that pick.

type Target = { l?: number; a?: number }
type Spec = { quiet?: Target; bold?: Target }

// Where each colour lands at the ends of the slider. L is OKLCH lightness
// (0-100); a is alpha. Muted text never goes lighter than Nova: 55.6 on white
// is already the AA floor.
const toneSpec: Record<Mode, Record<string, Spec>> = {
  light: {
    foreground: { quiet: { l: 22 } },
    "muted-foreground": { bold: { l: 48 } },
    border: { quiet: { l: 95 }, bold: { l: 87 } },
    input: { quiet: { l: 95 }, bold: { l: 87 } },
  },
  dark: {
    foreground: { quiet: { l: 90 } },
    "muted-foreground": { bold: { l: 78 } },
    border: { quiet: { a: 0.06 }, bold: { a: 0.16 } },
    input: { quiet: { a: 0.1 }, bold: { a: 0.22 } },
  },
}

/** The colours the slider reaches. */
export const toneTokens = Object.keys(toneSpec.light)

/** Every colour a dial may fill in. */
export const dialTokens = [...new Set([...neutralTokens, ...toneTokens])]

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount

/** One colour as the tone slider makes it, from the value it starts at. */
export function toneColor(
  mode: Mode,
  token: string,
  base: Color,
  tone: number
): Color {
  if (tone === 0) return base
  const spec = toneSpec[mode][token]?.[tone < 0 ? "quiet" : "bold"]
  const parsed = parseColor(base)
  if (!spec || !parsed) return base
  const amount = Math.abs(tone)
  const { l, c, h } = rgbaToOklch(parsed)
  return formatColor(
    oklchToRgba(
      spec.l === undefined ? l : lerp(l, spec.l, amount),
      c,
      h,
      spec.a === undefined ? parsed.a : lerp(parsed.a, spec.a, amount)
    ),
    "oklch"
  )
}

/**
 * The value the dials make for one colour, or null when none reaches it. The
 * tint comes first and the tone adjusts that result, so the two compose.
 */
export function generatedFor(
  mode: Mode,
  token: string,
  dials: Dials
): Color | null {
  const tinted = dials.neutrals.strength > 0 && neutralTokens.includes(token)
  const toned = dials.tone !== 0 && toneTokens.includes(token)
  if (!tinted && !toned) return null
  const base = tinted
    ? neutralFor(mode, token, dials.neutrals)
    : defaults[mode][token]
  return toneColor(mode, token, base, dials.tone)
}

// Type: [quiet, Nova, bold]. Leading is a ratio, so it scales with size.
const toneType: Record<string, [number, number, number]> = {
  "weight-normal": [400, 400, 500],
  "weight-medium": [400, 500, 600],
  "weight-strong": [500, 600, 700],
  "type-display": [22, 24, 28],
  "type-heading": [18, 20, 22],
  "type-title": [15, 16, 17],
}

/** The type tokens the slider reaches. */
export const toneTypeTokens = Object.keys(toneType)

/** One type value in the units the panel reads (px, or a weight number). */
export function toneTypeValue(token: string, tone: number): number {
  const [quiet, nova, bold] = toneType[token]
  const value = tone < 0 ? lerp(nova, quiet, -tone) : lerp(nova, bold, tone)
  return token.startsWith("weight")
    ? Math.round(value / 50) * 50
    : Math.round(value * 2) / 2
}

// --- Motion: none, subtle, edgy ---------------------------------------------
// None is Nova. Subtle cuts every duration by 40%, so changes land quietly.
// Edgy is 25% quicker and swaps the standard and enter curves for the
// emphasized one, which overshoots a little before it settles.

const durations = ["motion-fast", "motion-base", "motion-moderate", "motion-slow"]
const curves = ["motion-ease-standard", "motion-ease-enter"]

/** The motion tokens the dial reaches. */
export const dialMotionTokens = [...durations, ...curves]

/** One motion value as the dial makes it. */
export function motionFor(token: string, dial: MotionDial): string {
  const base = motionDefaults[token]
  if (dial === "none") return base
  if (durations.includes(token))
    return msToCss(toMs(base) * (dial === "subtle" ? 0.6 : 0.75))
  if (dial === "edgy" && curves.includes(token))
    return motionDefaults["motion-ease-emphasized"]
  return base
}
