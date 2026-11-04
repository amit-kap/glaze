// Dials: a few intents that generate many tokens. A dial only fills in colours
// the user has not taken over; the per-token edits stay the override.

import {
  formatColor,
  oklchToRgba,
  parseColor,
  rgbaToOklch,
} from "@amit-kap/glaze/lib/color"

import { motionDefaults, msToCss, toMs } from "./motion"
import { shapeDefaults, toCss as shapeCss, toPx } from "./shape"
import { toCss as typeCss, toNumber, typeDefaults } from "./typography"
import { defaults, tokens, type Color, type Mode } from "./theme"

/** The neutrals dial: a tint (hue in degrees) and how strongly it shows. */
export type NeutralsDial = { hue: number; strength: number }

/** How much character the motion has: Nova's own, calmer, or springier. */
export type MotionDial = "none" | "subtle" | "edgy"

/**
 * Two sliders from -1 to 1, where 0 is Nova. Tone runs quiet to bold. Scale
 * runs comfortable (airier) to compact.
 */
export type Dials = {
  neutrals: NeutralsDial
  tone: number
  scale: number
  motion: MotionDial
}

export const hues = { cool: 250, neutral: 0, warm: 70 } as const

export const dialDefaults: Dials = {
  neutrals: { hue: hues.warm, strength: 0 },
  tone: 0,
  scale: 0,
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
  dials: Dials,
  brand?: Color
): Color | null {
  const tinted = dials.neutrals.strength > 0 && neutralTokens.includes(token)
  // Without a tint of their own, bold surfaces borrow the brand's hue.
  const lent =
    !tinted && brand ? brandTint(mode, token, brand, dials.tone) : null
  const toned = dials.tone !== 0 && toneTokens.includes(token)
  if (!tinted && !lent && !toned) return null
  const base = tinted
    ? neutralFor(mode, token, dials.neutrals)
    : (lent ?? defaults[mode][token])
  return toneColor(mode, token, base, dials.tone)
}

// How strongly the bold end tints the neutrals with the brand's hue. Above
// 1 on purpose: near white, a tint needs more chroma than a mid grey to show.
const brandTintStrength = 2.5

/** A neutral tinted with the brand's hue, for the bold half of the slider. */
function brandTint(
  mode: Mode,
  token: string,
  brand: Color,
  tone: number
): Color | null {
  if (tone <= 0 || !neutralTokens.includes(token)) return null
  const parsed = parseColor(brand)
  if (!parsed) return null
  const { c, h } = rgbaToOklch(parsed)
  // A grey brand has no hue to lend.
  if (c < 0.02) return null
  return neutralFor(mode, token, { hue: h, strength: tone * brandTintStrength })
}

/**
 * Component tokens the tone slider sets outright. At the quiet end brand
 * stops colouring badges, so it is kept for actions and the interface reads
 * calmer; elsewhere the kit's own values stand.
 */
export function toneComponentVars(tone: number): Record<string, string> {
  return tone <= -0.4
    ? {
        "--badge-fill": "var(--secondary)",
        "--badge-ink": "var(--secondary-foreground)",
      }
    : {}
}

// Weights: [quiet, Nova, bold]. Size belongs to the scale slider.
const toneType: Record<string, [number, number, number]> = {
  "weight-normal": [400, 400, 500],
  "weight-medium": [400, 500, 600],
  "weight-strong": [500, 600, 700],
}

/** The type tokens the slider reaches. */
export const toneTypeTokens = Object.keys(toneType)

/** One weight, as a number, at a place on the tone slider. */
export function toneTypeValue(token: string, tone: number): number {
  const [quiet, nova, bold] = toneType[token]
  const value = tone < 0 ? lerp(nova, quiet, -tone) : lerp(nova, bold, tone)
  return Math.round(value / 50) * 50
}

// --- Motion: none, subtle, edgy ---------------------------------------------
// None is Nova. Subtle cuts every duration by 40%, so changes land quietly.
// Edgy is 25% quicker and swaps the standard and enter curves for the
// emphasized one, which overshoots a little before it settles.

const durations = [
  "motion-fast",
  "motion-base",
  "motion-moderate",
  "motion-slow",
]
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

// --- Scale: comfortable to compact -------------------------------------------
// One factor sets how roomy the interface is: the spacing unit (and with it
// every control height), corner radius and text size. Comfortable is up to
// 1.25 times Nova, compact down to 0.8. Text moves half as far as space, so
// copy stays readable at the compact end.

/** The factor at a place on the scale slider. */
export const scaleFactor = (scale: number) =>
  scale < 0 ? 1 + 0.25 * -scale : 1 - 0.2 * scale

/** The shape values the scale reaches. */
export const scaleShapeTokens = ["space-base", "radius"]

/** The text sizes the scale reaches. */
export const scaleTypeTokens = [
  "type-micro",
  "type-caption",
  "type-body",
  "type-title",
  "type-heading",
  "type-display",
]

/** One shape value, in CSS, at a place on the scale slider. */
export function scaleShapeValue(token: string, scale: number): string {
  const base = shapeDefaults[token]
  if (scale === 0) return base
  const px = toPx(base, shapeDefaults) * scaleFactor(scale)
  return shapeCss(Math.round(px * 4) / 4)
}

/** One text size, in CSS, at a place on the scale slider. */
export function scaleTypeValue(token: string, scale: number): string {
  const base = typeDefaults[token]
  if (scale === 0) return base
  const px = toNumber(base) * (1 + (scaleFactor(scale) - 1) * 0.5)
  return typeCss(token, Math.round(px * 2) / 2)
}
