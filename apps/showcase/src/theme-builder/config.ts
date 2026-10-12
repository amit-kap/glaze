import { parseConfig, type GlazeConfigInput } from "@amit-kap/glaze/lib/config"
import { generateThemeCss } from "@amit-kap/glaze/lib/generate"
import type { Density, Mode } from "@amit-kap/glaze/theme"

import { baseCss, type BaseTheme } from "./base-themes"
import { fonts, monoFonts } from "./inputs"
import type { Custom } from "./state"

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

  // Derive every corner family from the radius (the defaults in tokens.css),
  // so it takes effect on themes that set their shapes explicitly too.
  if (c.shared.radius !== undefined) {
    groups.shape["shape-item"] = "calc(var(--radius) * 0.8)"
    groups.shape["shape-floating"] = "var(--radius)"
    groups.shape["shape-container"] = "calc(var(--radius) * 1.4)"
  }
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
