import {
  builtInThemes,
  parseConfig,
  type GlazeConfigInput,
} from "@amit-kap/glaze/lib/config"
import { generateThemeCss, readThemeCss } from "@amit-kap/glaze/lib/generate"
import type { Density, Mode } from "@amit-kap/glaze/theme"
import nova from "@amit-kap/glaze/themes/nova.css?raw"
import vega from "@amit-kap/glaze/themes/vega.css?raw"
import maia from "@amit-kap/glaze/themes/maia.css?raw"
import lyra from "@amit-kap/glaze/themes/lyra.css?raw"
import mira from "@amit-kap/glaze/themes/mira.css?raw"
import luma from "@amit-kap/glaze/themes/luma.css?raw"
import sera from "@amit-kap/glaze/themes/sera.css?raw"
import rhea from "@amit-kap/glaze/themes/rhea.css?raw"
import gr8r from "@amit-kap/glaze/themes/gr8r.css?raw"

// The Customize sidebar's state → a Glaze config → the generated stylesheet.
// A theme's inputs are read from its CSS, so every control starts at the
// theme's own value, and only what the user changes goes into the config.

export type BaseTheme = (typeof builtInThemes)[number]
export const isBaseTheme = (v: string): v is BaseTheme =>
  (builtInThemes as readonly string[]).includes(v)

const baseCss: Record<BaseTheme, string> = {
  nova,
  vega,
  maia,
  lyra,
  mira,
  luma,
  sera,
  rhea,
  gr8r,
}

// --- Fonts ----------------------------------------------------------------

// Fonts the showcase already loads (through the built-in themes).
export const fonts = [
  {
    value: "geist",
    label: "Geist",
    family: '"Geist Variable", sans-serif',
    pkg: "@fontsource-variable/geist",
  },
  {
    value: "inter",
    label: "Inter",
    family: '"Inter Variable", sans-serif',
    pkg: "@fontsource-variable/inter",
  },
  {
    value: "figtree",
    label: "Figtree",
    family: '"Figtree Variable", sans-serif',
    pkg: "@fontsource-variable/figtree",
  },
  {
    value: "noto",
    label: "Noto Sans",
    family: '"Noto Sans Variable", sans-serif',
    pkg: "@fontsource-variable/noto-sans",
  },
  {
    value: "jetbrains",
    label: "JetBrains Mono",
    family: '"JetBrains Mono Variable", monospace',
    pkg: "@fontsource-variable/jetbrains-mono",
  },
]

export const headingFonts = [{ value: "same", label: "Same as sans" }, ...fonts]

export const monoFonts = [
  {
    value: "system",
    label: "System mono",
    family:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    pkg: undefined,
  },
  {
    value: "jetbrains",
    label: "JetBrains Mono",
    family: '"JetBrains Mono Variable", monospace',
    pkg: "@fontsource-variable/jetbrains-mono",
  },
]

export const controlShapes = [
  { value: "radius", label: "Follow radius" },
  { value: "pill", label: "Pill" },
]

// --- The inputs the sidebar edits ------------------------------------------

export const brandRows = [
  { key: "brand", label: "Brand" },
  { key: "brand-ink", label: "Brand ink" },
  { key: "canvas", label: "Canvas" },
  { key: "surface", label: "Surface" },
  { key: "ink", label: "Ink" },
  { key: "ink-muted", label: "Ink muted" },
  { key: "line", label: "Line" },
  { key: "overlay", label: "Overlay" },
]

export const statusRows = [
  { key: "danger", label: "Danger" },
  { key: "warning", label: "Warning" },
  { key: "success", label: "Success" },
  { key: "info", label: "Info" },
]

export const chartRows = [1, 2, 3, 4, 5].map((n) => ({
  key: `chart-${n}`,
  label: `Chart ${n}`,
}))

export const typeSteps = [
  { key: "caption", label: "Caption" },
  { key: "body", label: "Body" },
  { key: "title", label: "Title" },
  { key: "heading", label: "Heading" },
  { key: "display", label: "Display" },
]

export const weights = [
  { key: "weight-normal", label: "Normal" },
  { key: "weight-medium", label: "Medium" },
  { key: "weight-strong", label: "Strong" },
]

export const durations = [
  { key: "motion-fast", label: "Fast" },
  { key: "motion-base", label: "Base" },
  { key: "motion-moderate", label: "Moderate" },
  { key: "motion-slow", label: "Slow" },
]

export const easings = [
  { key: "motion-ease-standard", label: "Standard" },
  { key: "motion-ease-emphasized", label: "Emphasized" },
  { key: "motion-ease-enter", label: "Enter" },
  { key: "motion-ease-exit", label: "Exit" },
  { key: "motion-ease-spring", label: "Spring" },
]

export const elevations = [
  { key: "elevation-raised", label: "Raised" },
  { key: "elevation-floating", label: "Floating" },
  { key: "elevation-modal", label: "Modal" },
]

// Inputs read from a theme (the rest of the sidebar is derived from these).
const colorKeys = [...brandRows, ...statusRows, ...chartRows].map((r) => r.key)
const sharedKeys = [
  "radius",
  "shape-control",
  "space-base",
  "control-height",
  "typeface-sans",
  "typeface-heading",
  "typeface-mono",
  ...typeSteps.flatMap((s) => [`type-${s.key}`, `type-${s.key}-leading`]),
  ...weights.map((w) => w.key),
  ...elevations.map((e) => e.key),
  ...durations.map((d) => d.key),
  ...easings.map((e) => e.key),
]

// --- State ----------------------------------------------------------------

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
  const n = readThemeCss(nova)
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

// --- CSS values ↔ numbers -------------------------------------------------

/** "0.625rem" or "10px" → 10. */
export function toPx(value: string | undefined): number {
  const m = value?.match(/^\s*(-?[\d.]+)(rem|px)/)
  if (!m) return 0
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1])
}

export const pxToRem = (px: number) =>
  `${Math.round((px / 16) * 10000) / 10000}rem`

/** "1.5", "calc(1.25 / 0.875)" → a number; anything else → 0. */
export function toNumber(value: string | undefined): number {
  if (!value) return 0
  const div = value.match(/calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)/)
  if (div) return Number(div[1]) / Number(div[2])
  const n = Number.parseFloat(value)
  return Number.isNaN(n) ? 0 : n
}

/** "150ms" or "0.2s" → milliseconds. */
export function toMs(value: string | undefined): number {
  const m = value?.match(/^\s*([\d.]+)(ms|s)/)
  if (!m) return 0
  return m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1])
}

// --- Config ---------------------------------------------------------------

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

export function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  })
  a.click()
  URL.revokeObjectURL(url)
}

/** Black or white, whichever reads better on a hex colour (WCAG luminance). */
export function inkFor(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return (l + 0.05) / 0.05 > 1.05 / (l + 0.05) ? "#0a0a0a" : "#ffffff"
}
