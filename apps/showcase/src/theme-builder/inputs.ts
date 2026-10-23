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

// `derives` lists the tokens an input feeds (tokens.css), for the label
// tooltips in the sidebar.
export const brandRows = [
  { key: "brand", label: "Brand", derives: [] },
  { key: "brand-ink", label: "On brand", derives: [] },
  { key: "primary", label: "Primary", derives: ["--sidebar-primary"] },
  {
    key: "primary-foreground",
    label: "On primary",
    derives: ["--sidebar-primary-foreground"],
  },
  {
    key: "background",
    label: "Background",
    derives: ["--muted", "--sidebar", "--sidebar-accent"],
  },
  {
    key: "card",
    label: "Card",
    derives: ["--popover", "--secondary", "--accent"],
  },
  {
    key: "foreground",
    label: "Foreground",
    derives: [
      "--card-foreground",
      "--popover-foreground",
      "--sidebar-foreground",
    ],
  },
  { key: "muted-foreground", label: "Muted foreground", derives: [] },
  { key: "border", label: "Border", derives: ["--sidebar-border"] },
  { key: "input", label: "Input", derives: [] },
  { key: "ring", label: "Ring", derives: ["--sidebar-ring"] },
  { key: "overlay", label: "Overlay", derives: [] },
]

export const statusRows = [
  { key: "destructive", label: "Destructive", derives: [] },
  { key: "severity-critical", label: "Critical", derives: [] },
  { key: "severity-high", label: "High", derives: [] },
  { key: "severity-medium", label: "Medium", derives: [] },
  { key: "severity-low", label: "Low", derives: [] },
]

export const chartRows = [1, 2, 3, 4, 5].map((n) => ({
  key: `chart-${n}`,
  label: `Chart ${n}`,
  derives: [`--chart-${n}`],
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

// Preset shadows for the elevation tiers (and card-shadow). Matching is by
// CSS text, so anything a theme writes differently shows as "Custom".
export const shadowPresets = [
  { value: "none", label: "None", css: "0 0 #0000" },
  { value: "sm", label: "Subtle", css: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  {
    value: "md",
    label: "Raised",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  {
    value: "lg",
    label: "Floating",
    css: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  {
    value: "xl",
    label: "Lifted",
    css: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  // Luma/Rhea's modal tier, so their defaults don't read as "Custom".
  {
    value: "2xl",
    label: "Deep",
    css: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  {
    value: "3xl",
    label: "Deepest",
    css: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
]

// Preset curves for the easing inputs; the sidebar previews each one.
export const easingPresets = [
  { value: "standard", label: "Standard", css: "cubic-bezier(0.4, 0, 0.2, 1)" },
  {
    value: "decelerate",
    label: "Decelerate",
    css: "cubic-bezier(0, 0, 0.2, 1)",
  },
  {
    value: "accelerate",
    label: "Accelerate",
    css: "cubic-bezier(0.4, 0, 1, 1)",
  },
  // Nova's enter curve, so the base theme matches a preset out of the box.
  { value: "settle", label: "Settle", css: "cubic-bezier(0.22, 1, 0.36, 1)" },
  {
    value: "overshoot",
    label: "Overshoot",
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  { value: "snappy", label: "Snappy", css: "cubic-bezier(0.2, 0, 0, 1)" },
  { value: "linear", label: "Linear", css: "linear" },
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
