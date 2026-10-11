import { z } from "zod"

// A Glaze config describes one custom theme: a built-in theme to start from
// plus the inputs it changes. Spec: "Inputs" and "Writing a theme".
// Keys are input names without the leading "--", so each one maps 1:1 onto a
// CSS custom property and a new input only needs adding to a list below.

export const builtInThemes = [
  "nova",
  "vega",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
] as const

// Inputs that take a value per mode.
const colorInputs = [
  "canvas",
  "surface",
  "ink",
  "ink-muted",
  "line",
  "brand",
  "brand-ink",
  "danger",
  "warning",
  "success",
  "info",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "overlay",
  // optional, with fallbacks in tokens.css
  "caution",
  "sidebar-brand",
  "sidebar-brand-ink",
] as const

// Inputs that take one value for both modes, by group.
const shapeInputs = [
  "radius",
  "shape-item",
  "shape-control",
  "shape-floating",
  "shape-container",
] as const
const spaceInputs = ["space-base"] as const
const typeInputs = [
  "typeface-sans",
  "typeface-heading",
  "typeface-mono",
  "type-caption",
  "type-caption-leading",
  "type-body",
  "type-body-leading",
  "type-title",
  "type-title-leading",
  "type-heading",
  "type-heading-leading",
  "type-display",
  "type-display-leading",
  "weight-normal",
  "weight-medium",
  "weight-strong",
] as const
const elevationInputs = [
  "elevation-raised",
  "elevation-floating",
  "elevation-modal",
] as const
const motionInputs = [
  "motion-fast",
  "motion-base",
  "motion-moderate",
  "motion-slow",
  "motion-ease-standard",
  "motion-ease-emphasized",
  "motion-ease-exit",
  "motion-ease-enter",
] as const

// Any CSS value, as long as it can't end the declaration or the rule it is
// written into.
const cssValue = z
  .string()
  .trim()
  .min(1)
  .refine((v) => !/[;{}]/.test(v), "must be a single CSS value (no ; { or })")

const name = z
  .string()
  .regex(
    /^[a-z][a-z0-9-]*$/,
    "use lowercase letters, digits and dashes, starting with a letter"
  )
  .refine(
    (v) => !(builtInThemes as readonly string[]).includes(v),
    "must differ from the built-in themes"
  )

const inputs = <const K extends readonly string[]>(keys: K) =>
  z.strictObject(
    Object.fromEntries(keys.map((k) => [k, cssValue.optional()])) as Record<
      K[number],
      z.ZodOptional<typeof cssValue>
    >
  )

export const glazeConfigSchema = z.strictObject({
  $schema: z.string().optional(),
  version: z.literal(1),
  /** Theme name: the data-theme value and the generated file's name. */
  name,
  /** Built-in theme whose inputs this config starts from. */
  extends: z.enum(builtInThemes).default("nova"),
  /** ThemeProvider defaults. Mode and density stay switchable at runtime. */
  defaults: z
    .strictObject({
      mode: z.enum(["light", "dark", "system"]).optional(),
      density: z.enum(["comfortable", "compact"]).optional(),
    })
    .optional(),
  /** Font stylesheets to @import, e.g. "@fontsource-variable/inter". */
  fonts: z.array(cssValue).optional(),
  color: z
    .strictObject({
      light: inputs(colorInputs).optional(),
      dark: inputs(colorInputs).optional(),
    })
    .optional(),
  shape: inputs(shapeInputs).optional(),
  space: inputs(spaceInputs).optional(),
  type: inputs(typeInputs).optional(),
  elevation: inputs(elevationInputs).optional(),
  motion: inputs(motionInputs).optional(),
  /** Component tokens (spec: "Component tokens"), e.g. "button-radius-sm". */
  components: z
    .record(
      z
        .string()
        .regex(
          /^[a-z][a-z0-9-]*$/,
          "use a component token name without the leading --"
        ),
      cssValue
    )
    .optional(),
})

/** A config as written (defaults may be left out). */
export type GlazeConfigInput = z.input<typeof glazeConfigSchema>
/** A config after parsing, with defaults filled in. */
export type GlazeConfig = z.output<typeof glazeConfigSchema>

/** Parses and validates a config; throws a readable error listing every problem. */
export function parseConfig(value: unknown): GlazeConfig {
  const result = glazeConfigSchema.safeParse(value)
  if (result.success) return result.data
  const problems = result.error.issues.map(
    (i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`
  )
  throw new Error(`Invalid Glaze config:\n${problems.join("\n")}`)
}

/** Identity helper for typed configs written in TypeScript. */
export const defineConfig = (config: GlazeConfigInput) => config
