import { z } from "zod"

// A Glaze config describes one custom theme: a built-in theme to start from
// plus the inputs it changes. Spec: "Inputs" and "Writing a theme".
// Keys are input names without the leading "--", so each one maps 1:1 onto a
// CSS custom property and a new input only needs adding to a list below.

/** Nova is the only built-in theme; everything else is a saved theme. */
export const builtInThemes = ["nova"] as const

/** Themes that used to ship with Glaze; configs naming one start from Nova. */
const retiredThemes = [
  "vega",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
  "gr8r",
]

/**
 * Glaze release this config format and its generated CSS are written against.
 * Keep in step with `packages/ui/package.json`; `npm run check:catalog` does.
 */
export const glazeBaseline = "0.3.0"

// Inputs that take a value per mode.
const colorInputs = [
  // shadcn's variables
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  // Glaze extras
  "brand",
  "brand-ink",
  "overlay",
  "severity-critical",
  "severity-high",
  "severity-medium",
  "severity-low",
] as const

// Inputs that take one value for both modes, by group.
const shapeInputs = [
  "radius",
  "shape-item",
  "shape-control",
  "shape-floating",
  "shape-container",
] as const
// control-height is optional, with a fallback in tokens.css
const spaceInputs = ["space-base", "control-height"] as const
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
  /** System-token pins (spec: a theme may override a system token when the
      derivation can't express its intent), per mode, e.g. "secondary". */
  system: z
    .strictObject({
      light: z
        .record(
          z
            .string()
            .regex(
              /^[a-z][a-z0-9-]*$/,
              "use a system token name without the leading --"
            ),
          cssValue
        )
        .optional(),
      dark: z
        .record(
          z
            .string()
            .regex(
              /^[a-z][a-z0-9-]*$/,
              "use a system token name without the leading --"
            ),
          cssValue
        )
        .optional(),
    })
    .optional(),
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
  const result = glazeConfigSchema.safeParse(migrateNames(value))
  if (result.success) return result.data
  const problems = result.error.issues.map(
    (i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`
  )
  throw new Error(`Invalid Glaze config:\n${problems.join("\n")}`)
}

/**
 * Older configs use the library's own input names. They are shadcn's names
 * now, so move them rather than reject the file. A new name wins if a file
 * somehow carries both.
 */
const legacyNames: Record<string, string> = {
  canvas: "background",
  surface: "card",
  ink: "foreground",
  "ink-muted": "muted-foreground",
  line: "border",
  danger: "destructive",
  warning: "severity-medium",
  success: "severity-low",
  caution: "severity-high",
  "sidebar-brand": "brand",
  "sidebar-brand-ink": "brand-ink",
}

/** Colour names that no longer have a value to move to. */
const retiredNames = ["info"]

function migrateNames(value: unknown): unknown {
  if (!value || typeof value !== "object") return value
  const config = value as Record<string, unknown>
  let changed = false
  const next = { ...config }
  if (
    typeof config.extends === "string" &&
    retiredThemes.includes(config.extends)
  ) {
    next.extends = "nova"
    changed = true
  }
  for (const group of ["color", "system"] as const) {
    const blocks = config[group]
    if (!blocks || typeof blocks !== "object") continue
    const nextBlocks = { ...(blocks as Record<string, unknown>) }
    let groupChanged = false
    for (const mode of ["light", "dark"]) {
      const block = nextBlocks[mode]
      if (!block || typeof block !== "object") continue
      const values = { ...(block as Record<string, unknown>) }
      let moved = false
      for (const [oldName, newName] of Object.entries(legacyNames)) {
        if (!(oldName in values)) continue
        if (values[newName] === undefined) values[newName] = values[oldName]
        delete values[oldName]
        moved = true
      }
      for (const name of retiredNames) {
        if (!(name in values)) continue
        delete values[name]
        moved = true
      }
      if (moved) {
        nextBlocks[mode] = values
        groupChanged = true
      }
    }
    if (groupChanged) {
      next[group] = nextBlocks
      changed = true
    }
  }
  return changed ? next : value
}

/** Identity helper for typed configs written in TypeScript. */
export const defineConfig = (config: GlazeConfigInput) => config
