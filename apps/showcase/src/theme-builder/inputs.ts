// The inputs the Customize sidebar edits: option lists for selects, and the
// token rows each colour/shape/type/motion control maps to.

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
export const colorKeys = [...brandRows, ...statusRows, ...chartRows].map(
  (r) => r.key
)
export const sharedKeys = [
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
