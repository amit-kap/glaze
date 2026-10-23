// The colours Studio edits, in shadcn's names. Values follow Nova's defaults
// (packages/ui/src/styles/themes/nova.css); everything else in the library is
// derived from these, so the preview only needs to set the tokens below.

export type Color = {
  /** Lightness, 0–100. */
  l: number
  /** Chroma, 0–0.4. */
  c: number
  /** Hue, 0–360. */
  h: number
  /** Alpha, 0–1. Left out when the colour is opaque. */
  a?: number
}

export type Mode = "light" | "dark"

export const tokens = [
  { token: "brand", label: "Brand", group: "brand" },
  { token: "brand-ink", label: "On brand", group: "brand" },
  { token: "primary", label: "Primary", group: "brand" },
  { token: "primary-foreground", label: "On primary", group: "brand" },
  { token: "background", label: "Background", group: "surfaces" },
  { token: "card", label: "Card", group: "surfaces" },
  { token: "sidebar", label: "Sidebar", group: "surfaces" },
  { token: "overlay", label: "Overlay", group: "surfaces" },
  { token: "muted", label: "Muted", group: "fills" },
  { token: "secondary", label: "Secondary", group: "fills" },
  { token: "accent", label: "Accent", group: "fills" },
  { token: "foreground", label: "Foreground", group: "text" },
  { token: "muted-foreground", label: "Muted foreground", group: "text" },
  { token: "border", label: "Border", group: "borders" },
  { token: "input", label: "Input", group: "borders" },
  { token: "ring", label: "Ring", group: "borders" },
  { token: "destructive", label: "Destructive", group: "status" },
  { token: "severity-critical", label: "Critical", group: "status" },
  { token: "severity-high", label: "High", group: "status" },
  { token: "severity-medium", label: "Medium", group: "status" },
  { token: "severity-low", label: "Low", group: "status" },
  { token: "chart-1", label: "Series 1", group: "charts" },
  { token: "chart-2", label: "Series 2", group: "charts" },
  { token: "chart-3", label: "Series 3", group: "charts" },
  { token: "chart-4", label: "Series 4", group: "charts" },
  { token: "chart-5", label: "Series 5", group: "charts" },
] as const

export type Token = (typeof tokens)[number]["token"]

export const groups = [
  { id: "brand", title: "Brand", open: true },
  { id: "surfaces", title: "Surfaces", open: true },
  { id: "fills", title: "Fills", open: true },
  { id: "text", title: "Text", open: true },
  { id: "borders", title: "Borders", open: true },
  { id: "status", title: "Status", open: false },
  { id: "charts", title: "Charts", open: false },
] as const

const opaque = (
  l: number,
  c = 0,
  h = 0,
): Color => ({ l, c, h })

export const defaults: Record<Mode, Record<Token, Color>> = {
  light: {
    brand: opaque(20.5),
    "brand-ink": opaque(98.5),
    primary: opaque(20.5),
    "primary-foreground": opaque(98.5),
    background: opaque(100),
    card: opaque(100),
    sidebar: opaque(98.5),
    overlay: { l: 0, c: 0, h: 0, a: 0.5 },
    muted: opaque(97),
    secondary: opaque(97),
    accent: opaque(97),
    foreground: opaque(14.5),
    "muted-foreground": opaque(55.6),
    border: opaque(92.2),
    input: opaque(92.2),
    ring: opaque(70.8),
    destructive: opaque(57.7, 0.245, 27.325),
    "severity-critical": opaque(57.7, 0.245, 27.325),
    "severity-high": opaque(55.3, 0.195, 38.402),
    "severity-medium": opaque(55.4, 0.135, 66.442),
    "severity-low": opaque(52.7, 0.154, 150.069),
    "chart-1": opaque(87),
    "chart-2": opaque(55.6),
    "chart-3": opaque(43.9),
    "chart-4": opaque(37.1),
    "chart-5": opaque(26.9),
  },
  dark: {
    brand: opaque(92.2),
    "brand-ink": opaque(20.5),
    primary: opaque(92.2),
    "primary-foreground": opaque(20.5),
    background: opaque(14.5),
    card: opaque(20.5),
    sidebar: opaque(20.5),
    overlay: { l: 0, c: 0, h: 0, a: 0.5 },
    muted: opaque(26.9),
    secondary: opaque(26.9),
    accent: opaque(26.9),
    foreground: opaque(98.5),
    "muted-foreground": opaque(70.8),
    border: { l: 100, c: 0, h: 0, a: 0.1 },
    input: { l: 100, c: 0, h: 0, a: 0.15 },
    ring: opaque(55.6),
    destructive: opaque(70.4, 0.191, 22.216),
    "severity-critical": opaque(70.4, 0.191, 22.216),
    "severity-high": opaque(75, 0.183, 55.934),
    "severity-medium": opaque(85.2, 0.199, 91.936),
    "severity-low": opaque(79.2, 0.209, 151.711),
    "chart-1": opaque(87),
    "chart-2": opaque(55.6),
    "chart-3": opaque(43.9),
    "chart-4": opaque(37.1),
    "chart-5": opaque(26.9),
  },
}

export const cssColor = (color: Color) =>
  color.a === undefined
    ? `oklch(${color.l}% ${color.c} ${color.h})`
    : `oklch(${color.l}% ${color.c} ${color.h} / ${color.a})`

/** The variables a preview scopes to itself. */
export function cssVars(colors: Record<Token, Color>) {
  return Object.fromEntries(
    tokens.map(({ token }) => [`--${token}`, cssColor(colors[token])]),
  ) as Record<string, string>
}

export function countChanges(
  light: Record<Token, Color>,
  dark: Record<Token, Color>,
) {
  let n = 0
  for (const { token } of tokens) {
    for (const mode of ["light", "dark"] as const) {
      const next = mode === "light" ? light[token] : dark[token]
      const base = defaults[mode][token]
      if (
        next.l !== base.l ||
        next.c !== base.c ||
        next.h !== base.h ||
        next.a !== base.a
      )
        n++
    }
  }
  return n
}

/* oklch → sRGB, for the contrast readout. */

const fromLinear = (channel: number) =>
  channel <= 0.0031308
    ? channel * 12.92
    : 1.055 * channel ** (1 / 2.4) - 0.055

function oklchToLinearRgb(color: Color) {
  const h = (color.h * Math.PI) / 180
  const a = color.c * Math.cos(h)
  const b = color.c * Math.sin(h)
  const l = (color.l / 100 + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (color.l / 100 - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (color.l / 100 - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

export function toHex(color: Color) {
  const [r, g, b] = oklchToLinearRgb(color).map((v) =>
    Math.round(Math.min(1, Math.max(0, fromLinear(v))) * 255),
  )
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`
}

export function luminance(color: Color) {
  const [r, g, b] = oklchToLinearRgb(color).map((v) =>
    Math.min(1, Math.max(0, v)),
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(fg: Color, bg: Color) {
  const a = luminance(fg)
  const b = luminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

export function contrastLabel(ratio: number) {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

