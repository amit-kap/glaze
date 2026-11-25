// The pre-made themes Home offers. Each is a `Stored`, the shape the library
// saves, built from Nova the way the panel builds a draft: a dial sets the
// values it owns, and `sanitize` settles every following colour (primary,
// ink, charts, tinted neutrals) so the data is valid by construction.

import {
  dialDefaults,
  dialMotionTokens,
  motionFor,
  scaleShapeTokens,
  scaleShapeValue,
  scaleTypeTokens,
  scaleTypeValue,
  toneTypeTokens,
  toneTypeValue,
  type Dials,
  type MotionDial,
} from "./dials"
import { fresh, sanitize, type Stored } from "./draft"
import { canonical, defaults, type Color } from "./theme"
import type { MotionValues } from "./motion"
import type { ShapeValues } from "./shape"
import { toCss as typeCss, type TypeValues } from "./typography"

export type Template = { name: string; data: Stored }

type Recipe = {
  brand: Color
  /** Primary follows Brand, or stays Nova's own neutral. */
  primary: "brand" | "neutral"
  /** The light page colour, where the tint alone leaves Nova's pure white. */
  paper?: Color
  /** Surfaces and borders take a tint of the brand's hue. */
  tinted: boolean
  sans: string
  heading?: string
  mono?: string
  tone: number
  scale: number
  motion: MotionDial
}

function build(recipe: Recipe): Stored {
  const base = fresh()
  const dials: Dials = {
    ...dialDefaults,
    neutrals: recipe.tinted
      ? { hue: 0, strength: 1.5, brand: true, surfaces: true, borders: true }
      : dialDefaults.neutrals,
    tone: recipe.tone,
    scale: recipe.scale,
    motion: recipe.motion,
  }

  const brand = canonical(recipe.brand)
  const theme = {
    light: {
      ...defaults.light,
      brand,
      ...(recipe.paper && { background: canonical(recipe.paper) }),
    },
    dark: { ...defaults.dark, brand },
  }
  const held =
    recipe.primary === "neutral" ? ["primary", "primary-foreground"] : []
  // A hand-set page colour is the theme's own, so the tint leaves it alone.
  const lightHeld = recipe.paper ? [...held, "background"] : held

  const type: TypeValues = { ...base.type, "typeface-sans": recipe.sans }
  if (recipe.heading) type["typeface-heading"] = recipe.heading
  if (recipe.mono) type["typeface-mono"] = recipe.mono
  if (recipe.tone !== 0)
    for (const token of toneTypeTokens)
      type[token] = typeCss(token, toneTypeValue(token, recipe.tone, null))
  if (recipe.scale !== 0)
    for (const token of scaleTypeTokens)
      type[token] = scaleTypeValue(token, recipe.scale)

  const shape: ShapeValues = { ...base.shape }
  if (recipe.scale !== 0)
    for (const token of scaleShapeTokens)
      shape[token] = scaleShapeValue(token, recipe.scale)

  const motion: MotionValues = { ...base.motion }
  for (const token of dialMotionTokens)
    motion[token] = motionFor(token, recipe.motion)

  return sanitize({
    theme,
    unlinked: { light: lightHeld, dark: held },
    type,
    shape,
    motion,
    dials,
  })
}

/** Nova: the default, untouched. */
const nova: Template = { name: "Nova", data: fresh() }

/** Editorial and warm: serif headings, paper-tinted neutrals, quiet and roomy. */
const folio: Template = {
  name: "Folio",
  data: build({
    brand: "oklch(0.56 0.15 38)",
    paper: "oklch(0.985 0.011 80)",
    primary: "brand",
    tinted: true,
    sans: '"Figtree Variable", sans-serif',
    heading: '"Playfair Display Variable", serif',
    tone: -0.6,
    scale: -0.5,
    motion: "subtle",
  }),
}

/** Technical and sharp: compact, bold, a vivid cool brand, springy motion. */
const volt: Template = {
  name: "Volt",
  data: build({
    brand: "oklch(0.66 0.2 255)",
    primary: "brand",
    tinted: true,
    sans: '"Inter Variable", sans-serif',
    heading: '"JetBrains Mono Variable", monospace',
    mono: '"JetBrains Mono Variable", monospace',
    tone: 0.8,
    scale: 0.8,
    motion: "edgy",
  }),
}

export const templates: Template[] = [nova, folio, volt]
