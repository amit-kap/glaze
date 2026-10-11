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

// The panel's custom-theme state → a Glaze config → the generated stylesheet.

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

export const controlShapes = [
  { value: "radius", label: "Follow radius" },
  { value: "pill", label: "Pill" },
]

/** The values the Customize section edits. */
export type Values = {
  brandLight: string
  brandDark: string
  /** Base corner radius in px. */
  radius: number
  /** Default control height in px, before density. */
  height: number
  controls: string
  font: string
}

/** What the user changed; anything left out shows the theme's own value. */
export type Custom = { name: string } & Partial<Values>

export const emptyCustom: Custom = { name: "my-theme" }

export const isCustomized = (c: Custom) =>
  (["brandLight", "brandDark", "radius", "height", "controls", "font"] as const).some(
    (k) => c[k] !== undefined
  )

/** A theme's own values for the Customize section, read from its CSS. */
export function themeDefaults(base: BaseTheme): Values {
  // Inputs the theme leaves out come from Nova.
  const n = readThemeCss(nova)
  const t = readThemeCss(baseCss[base])
  const get = (mode: "light" | "dark", key: string) =>
    t[mode].get(key) ?? n[mode].get(key) ?? ""
  const rem = get("light", "--radius").match(/([\d.]+)rem/)
  const family = get("light", "--typeface-sans")
  // Theme's control height, or 8 spacing steps when it doesn't set one.
  const px = (v: string) => Number(v.match(/([\d.]+)rem/)?.[1] ?? 0) * 16
  const height =
    px(get("light", "--control-height")) || px(get("light", "--space-base")) * 8
  return {
    brandLight: oklchToHex(get("light", "--brand")),
    brandDark: oklchToHex(get("dark", "--brand")),
    radius: rem ? Math.round(Number(rem[1]) * 16) : 0,
    height: Math.round(height),
    controls: get("light", "--shape-control") === "9999px" ? "pill" : "radius",
    font: fonts.find((f) => f.family === family)?.value ?? "geist",
  }
}

/** oklch(L C H) → #rrggbb, clamped to sRGB (Björn Ottosson's OKLab matrices). */
export function oklchToHex(value: string): string {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return value.startsWith("#") ? value.slice(0, 7) : "#000000"
  const [L, C, H] = m.slice(1).map(Number)
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const rgb = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ]
  return (
    "#" +
    rgb
      .map((c) => {
        const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
        return Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, "0")
      })
      .join("")
  )
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
  const brand = (hex: string | undefined) =>
    hex ? { brand: hex, "brand-ink": inkFor(hex) } : undefined
  if (c.brandLight || c.brandDark)
    config.color = { light: brand(c.brandLight), dark: brand(c.brandDark) }

  const shape: Record<string, string> = {}
  if (c.radius !== undefined) {
    // Derive every family from the radius (the defaults in tokens.css), so it
    // takes effect on themes that set their shapes explicitly too.
    shape.radius = `${c.radius / 16}rem`
    shape["shape-item"] = "calc(var(--radius) * 0.8)"
    shape["shape-floating"] = "var(--radius)"
    shape["shape-container"] = "calc(var(--radius) * 1.4)"
  }
  if (c.controls === "radius") shape["shape-control"] = "var(--radius)"
  if (c.controls === "pill") shape["shape-control"] = "9999px"
  if (Object.keys(shape).length) config.shape = shape

  if (c.height !== undefined)
    config.space = { "control-height": `${c.height / 16}rem` }

  const font = fonts.find((f) => f.value === c.font)
  if (font) {
    config.type = { "typeface-sans": font.family }
    config.fonts = [font.pkg]
  }
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
