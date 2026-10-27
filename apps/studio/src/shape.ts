// The shape Studio edits: corner radii, the spacing unit and control height,
// and shadow depth. Names, labels and notes come from the library catalog; the
// defaults come from Nova and from the kit's tokens, so there is no second copy
// of either. Shape is shared by both modes, so the draft keeps one set. Values
// are the CSS strings a theme exports. A family corner that nobody set keeps
// the kit's own formula (`calc(var(--radius) * 0.8)`), so it follows the base
// radius until it is set.

import { formatColor, parseColor, type Rgba } from "@amit-kap/glaze/lib/color"
import tokensCss from "@amit-kap/glaze/tokens.css?raw"
import { settingSections, settings } from "@amit-kap/glaze/theme/catalog"

import { declarations, novaRoot } from "./theme"

export type ShapeValues = Record<string, string>

export type ShapeKind = "length" | "shadow"

export type ShapeRow = {
  token: string
  label: string
  note: string
  kind: ShapeKind
}

export type ShapeGroup = {
  id: string
  title: string
  note: string
  rows: ShapeRow[]
}

const tokenOf = (token: string) => token.replace(/^--/, "")

// Panel order: what a person reaches for first (roundness), then the rhythm
// of the layout, then depth.
const groupTokens: Record<string, string[]> = {
  corners: [
    "radius",
    "shape-item",
    "shape-control",
    "shape-floating",
    "shape-container",
  ],
  spacing: ["space-base", "control-height"],
  shadows: [
    "elevation-raised",
    "elevation-floating",
    "elevation-modal",
    "card-shadow",
  ],
}

// A token can be listed twice (a component detail repeats its shared value);
// the first entry is the one in the setting's own section.
const settingOf = Object.fromEntries(
  [...settings].reverse().map((setting) => [tokenOf(setting.token), setting])
)

export const shapeGroups: ShapeGroup[] = Object.entries(groupTokens).map(
  ([id, tokens]) => {
    const section = settingSections.find((item) => item.id === id)
    return {
      id,
      title: section?.title ?? id,
      note: section?.note ?? "",
      rows: tokens.map((token) => {
        const setting = settingOf[token]
        return {
          token,
          label: setting.label,
          note: setting.note,
          kind: setting.kind === "shadow" ? "shadow" : "length",
        }
      }),
    }
  }
)

export const shapeTokens = shapeGroups.flatMap((group) =>
  group.rows.map((row) => row.token)
)

const kindOf = Object.fromEntries(
  shapeGroups.flatMap((group) => group.rows.map((r) => [r.token, r.kind]))
) as Record<string, ShapeKind>

const squash = (css: string) => css.trim().replace(/\s+/g, " ")

const kitRoot = declarations(tokensCss, tokensCss.indexOf(":where(:root, "))

// Nova sets the base radius, the spacing unit and the three elevations; the
// kit supplies the family corners and the card shadow; the control height is
// optional, with the catalog's own fallback.
export const shapeDefaults: ShapeValues = Object.fromEntries(
  shapeTokens.map((token) => [
    token,
    squash(
      novaRoot.get(token) ??
        kitRoot.get(token) ??
        settingOf[token].fallback ??
        ""
    ),
  ])
)

// --- Lengths ---------------------------------------------------------------

const REM = 16

const plain = (css: string) => {
  const rem = css.match(/^([\d.]+)rem$/)
  if (rem) return Number(rem[1]) * REM
  const px = css.match(/^([\d.]+)px$/)
  if (px) return Number(px[1])
  return null
}

/**
 * A length as pixels. Understands the three shapes the kit writes: a number,
 * `var(--x)`, and `calc(var(--x) * k)`, reading `--x` from the other values.
 */
export function toPx(css: string | undefined, values: ShapeValues): number {
  const text = squash(css ?? "")
  const direct = plain(text)
  if (direct !== null) return direct
  const ref = text.match(/^var\(--([\w-]+)\)$/)
  if (ref) return toPx(values[ref[1]], values)
  const scaled = text.match(/^calc\(var\(--([\w-]+)\) \* ([\d.]+)\)$/)
  if (scaled) return toPx(values[scaled[1]], values) * Number(scaled[2])
  return 0
}

/** The CSS a length is stored and exported as. */
export const toCss = (px: number) => `${+(px / REM).toFixed(4)}rem`

export function sameShape(token: string, a: string, b: string) {
  if (squash(a) === squash(b)) return true
  if (kindOf[token] === "shadow") return sameShadow(a, b)
  const first = plain(squash(a))
  const second = plain(squash(b))
  return first !== null && second !== null && Math.abs(first - second) < 0.01
}

export const shapeChanged = (token: string, value: string) =>
  !sameShape(token, value, shapeDefaults[token])

export const countShapeChanges = (values: ShapeValues) =>
  shapeTokens.filter((token) => shapeChanged(token, values[token])).length

// --- Shadows ---------------------------------------------------------------

// A shadow is a stack of layers; each is an offset, a blur, a spread and a
// colour. The draft keeps the CSS string, and the editor reads and writes it
// through these.
export type ShadowLayer = {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

const COLOR = /(?:rgba?|hsla?|oklch|oklab|color)\([^)]*\)|#[\da-f]{3,8}\b/i

// Commas inside a colour (`rgb(0, 0, 0)`) don't separate layers.
function splitLayers(css: string) {
  const layers: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "(") depth++
    else if (css[i] === ")") depth--
    else if (css[i] === "," && depth === 0) {
      layers.push(css.slice(start, i))
      start = i + 1
    }
  }
  layers.push(css.slice(start))
  return layers.map(squash).filter(Boolean)
}

export function parseShadow(css: string): ShadowLayer[] {
  return splitLayers(css).map((layer) => {
    const color = layer.match(COLOR)?.[0] ?? "rgb(0 0 0 / 0.1)"
    const rest = layer.replace(COLOR, " ")
    const lengths = (rest.match(/-?[\d.]+(?:px|rem)?/g) ?? []).map((token) =>
      token.endsWith("rem") ? parseFloat(token) * REM : parseFloat(token)
    )
    return {
      x: lengths[0] ?? 0,
      y: lengths[1] ?? 0,
      blur: lengths[2] ?? 0,
      spread: lengths[3] ?? 0,
      color,
      inset: /\binset\b/.test(rest),
    }
  })
}

const length = (n: number) => (n === 0 ? "0" : `${+n.toFixed(2)}px`)

export function formatShadow(layers: ShadowLayer[]) {
  return layers
    .map((l) =>
      [
        l.inset && "inset",
        length(l.x),
        length(l.y),
        length(l.blur),
        length(l.spread),
        l.color,
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(", ")
}

const black: Rgba = { r: 0, g: 0, b: 0, a: 1 }

/** A layer's opacity, 0 to 1. */
export const shadowAlpha = (color: string) => (parseColor(color) ?? black).a

/** The same colour at another opacity, written the way Nova writes it. */
export const withAlpha = (color: string, a: number) =>
  formatColor({ ...(parseColor(color) ?? black), a }, "rgb")

const near = (a: number, b: number, tolerance: number) =>
  Math.abs(a - b) < tolerance

function sameShadow(a: string, b: string) {
  const first = parseShadow(a)
  const second = parseShadow(b)
  return (
    first.length === second.length &&
    first.every((layer, i) => {
      const other = second[i]
      return (
        layer.inset === other.inset &&
        near(layer.x, other.x, 0.01) &&
        near(layer.y, other.y, 0.01) &&
        near(layer.blur, other.blur, 0.01) &&
        near(layer.spread, other.spread, 0.01) &&
        near(shadowAlpha(layer.color), shadowAlpha(other.color), 0.005)
      )
    })
  )
}

/** The values a preview scopes to itself. */
export function shapeVars(values: ShapeValues) {
  return Object.fromEntries(
    shapeTokens.map((token) => [`--${token}`, values[token]])
  ) as Record<string, string>
}

// --- Density -----------------------------------------------------------------

// Density is runtime state, not a theme value: it is compared in the preview
// and never saved or exported, so it lives outside the draft.
export type Density = "comfortable" | "compact"

export const densityOptions: { label: string; value: Density }[] = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
]

export const densitySetting = settingOf["density"]
