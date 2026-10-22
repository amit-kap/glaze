import { formatColor, parseColor } from "@amit-kap/glaze/lib/color"
import { parseConfig, type GlazeConfigInput } from "@amit-kap/glaze/lib/config"
import { generateThemeCss } from "@amit-kap/glaze/lib/generate"
import type { Density, Mode } from "@amit-kap/glaze/theme"

import { baseCss, type BaseTheme } from "./base-themes"
import { fonts, monoFonts, sharedKeys } from "./inputs"
import { emptyCustom, type Custom, type Defaults } from "./state"

// The Customize sidebar's state → a Glaze config → the generated stylesheet.

const groupOf = (key: string) =>
  key === "radius" || key.startsWith("shape-")
    ? "shape"
    : key === "space-base" || key === "control-height"
      ? "space"
      : key.startsWith("typeface-") ||
          key.startsWith("type-") ||
          key.startsWith("weight-")
        ? "type"
        : key.startsWith("elevation-")
          ? "elevation"
          : key.startsWith("motion-") && key !== "motion-ease-spring"
            ? "motion"
            : "components"

const radiusFamilies: Record<string, string> = {
  "shape-item": "calc(var(--radius) * 0.8)",
  "shape-floating": "var(--radius)",
  "shape-container": "calc(var(--radius) * 1.4)",
}

export function toConfig(
  base: BaseTheme,
  c: Custom,
  mode: Mode,
  density: Density
): GlazeConfigInput {
  const config: GlazeConfigInput = {
    version: 1,
    name: c.name,
    extends: base,
    defaults: { mode, density },
  }
  const some = (o: object) => Object.keys(o).length > 0
  if (some(c.light) || some(c.dark))
    config.color = {
      light: some(c.light) ? c.light : undefined,
      dark: some(c.dark) ? c.dark : undefined,
    }
  if (c.system && (some(c.system.light) || some(c.system.dark)))
    config.system = {
      light: some(c.system.light) ? c.system.light : undefined,
      dark: some(c.system.dark) ? c.system.dark : undefined,
    }

  const groups: Record<string, Record<string, string>> = {
    shape: {},
    space: {},
    type: {},
    elevation: {},
    motion: {},
    components: {},
  }
  for (const [key, value] of Object.entries(c.shared))
    groups[groupOf(key)][key] = value
  Object.assign(groups.components, c.components)

  // Derive every corner family from the radius (the defaults in tokens.css),
  // so it takes effect on themes that set their shapes explicitly too.
  if (c.shared.radius !== undefined) Object.assign(groups.shape, radiusFamilies)
  if (c.controls === "radius") groups.shape["shape-control"] = "var(--radius)"
  if (c.controls === "pill") groups.shape["shape-control"] = "9999px"

  const imports = new Set<string>()
  const pick = <T extends { family: string; pkg?: string }>(
    list: T[],
    value: string | undefined
  ) => {
    const font = list.find((f) => (f as { value?: string }).value === value)
    if (font?.pkg) imports.add(font.pkg)
    return font
  }
  const sans = pick(fonts, c.font)
  if (sans) groups.type["typeface-sans"] = sans.family
  if (c.headingFont === "same")
    groups.type["typeface-heading"] = "var(--typeface-sans)"
  else {
    const heading = pick(fonts, c.headingFont)
    if (heading) groups.type["typeface-heading"] = heading.family
  }
  const mono = pick(monoFonts, c.monoFont)
  if (mono) groups.type["typeface-mono"] = mono.family
  if (c.fades === false) groups.components["fade-scale"] = "0"

  for (const [group, values] of Object.entries(groups))
    if (some(values)) (config as Record<string, unknown>)[group] = values
  if (imports.size) config.fonts = [...imports]
  return config
}

const hex = (css: string) => {
  const parsed = parseColor(css)
  return parsed ? formatColor(parsed, "hex") : null
}

/**
 * The inverse of toConfig: a config (loaded from a file or a share link) as
 * the sidebar's state against `defaults`, the base theme's own values.
 * Values equal to the defaults are dropped, so the change count stays
 * honest; anything the sidebar has no control for stays in `shared` or
 * `components` so a round trip loses nothing.
 */
export function fromConfig(
  config: GlazeConfigInput,
  defaults: Defaults
): Custom {
  const c: Custom = {
    ...emptyCustom,
    name: config.name,
    light: {},
    dark: {},
    shared: {},
  }
  const some = (o: object) => Object.keys(o).length > 0
  const entries = (o: object | undefined) =>
    Object.entries(o ?? {}).filter(
      (e): e is [string, string] => typeof e[1] === "string"
    )

  for (const mode of ["light", "dark"] as const)
    for (const [key, value] of entries(config.color?.[mode])) {
      const own = hex(value) ?? value
      if (own !== hex(defaults[mode][key] ?? "")) c[mode][key] = own
    }

  const system = { light: {}, dark: {} } as NonNullable<Custom["system"]>
  for (const mode of ["light", "dark"] as const)
    for (const [key, value] of entries(config.system?.[mode]))
      system[mode][key] = value
  if (some(system.light) || some(system.dark)) c.system = system

  // Group-independent: every key maps back to one shared input.
  const shared: Record<string, string> = {}
  for (const group of [
    config.shape,
    config.space,
    config.type,
    config.elevation,
    config.motion,
  ])
    for (const [key, value] of entries(group)) shared[key] = value
  const components: Record<string, string> = {}
  for (const [key, value] of entries(config.components)) {
    // motion-ease-spring has no schema group, so toConfig writes it here.
    if (sharedKeys.includes(key)) shared[key] = value
    else if (key === "fade-scale" && value.trim() === "0") c.fades = false
    else components[key] = value
  }
  if (some(components)) c.components = components

  const control = shared["shape-control"]
  if (control !== undefined) {
    const controls = control === "9999px" ? "pill" : "radius"
    if (controls !== defaults.controls) c.controls = controls
    delete shared["shape-control"]
  }
  // The corner families toConfig derives from the radius carry no information
  // of their own.
  if (shared.radius !== undefined)
    for (const [key, formula] of Object.entries(radiusFamilies))
      if (shared[key] === formula) delete shared[key]

  const family = (
    key: string,
    list: { value: string; family: string }[],
    field: "font" | "headingFont" | "monoFont"
  ) => {
    const value = shared[key]
    if (value === undefined) return
    const match =
      field === "headingFont" && value.trim() === "var(--typeface-sans)"
        ? "same"
        : list.find((f) => f.family === value.trim())?.value
    if (!match) return
    if (match !== defaults[field]) c[field] = match
    delete shared[key]
  }
  family("typeface-sans", fonts, "font")
  family("typeface-heading", fonts, "headingFont")
  family("typeface-mono", monoFonts, "monoFont")

  for (const [key, value] of Object.entries(shared))
    if (value.trim() !== defaults.shared[key]?.trim()) c.shared[key] = value
  return c
}

/** The generated stylesheet, or the validation error to show instead. */
export function themeCss(
  config: GlazeConfigInput
): { css: string } | { error: string } {
  try {
    const parsed = parseConfig(config)
    return { css: generateThemeCss(parsed, baseCss[parsed.extends]) }
  } catch (error) {
    return {
      error: (error as Error).message.replace(
        /^Invalid Glaze config:\n\s*/,
        ""
      ),
    }
  }
}
