/*
 * Names and groupings only — never values. The Theme stories read the live
 * cascade, so a page listing "--muted" documents all nine themes, both modes
 * and both densities without a second source of truth.
 */

export type Swatch = { token: string; on?: string }

export const colors: { title: string; note?: string; tokens: Swatch[] }[] = [
  {
    title: "Surfaces and text",
    note: "Nested surfaces use the same tokens: a card on a page, a popover on a card.",
    tokens: [
      { token: "--background" },
      { token: "--card" },
      { token: "--popover" },
      { token: "--muted" },
      { token: "--foreground", on: "--background" },
      { token: "--card-foreground", on: "--card" },
      { token: "--popover-foreground", on: "--popover" },
      { token: "--muted-foreground", on: "--muted" },
      { token: "--subtle-foreground", on: "--background" },
    ],
  },
  {
    title: "Actions",
    note: "One brand moment per screen: the primary action. Everything else stays neutral.",
    tokens: [
      { token: "--primary" },
      { token: "--primary-foreground", on: "--primary" },
      { token: "--primary-subtle" },
      { token: "--primary-border" },
      { token: "--secondary" },
      { token: "--secondary-foreground", on: "--secondary" },
    ],
  },
  {
    title: "Interaction states",
    note: "States are their own tokens so a theme can tint them without touching components.",
    tokens: [
      { token: "--hover" },
      { token: "--active" },
      { token: "--selected" },
      { token: "--accent" },
      { token: "--accent-foreground", on: "--accent" },
      { token: "--overlay" },
    ],
  },
  {
    title: "Lines and focus",
    tokens: [
      { token: "--border" },
      { token: "--border-strong" },
      { token: "--input" },
      { token: "--ring" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { token: "--destructive", on: "--background" },
      { token: "--danger" },
      { token: "--danger-subtle" },
      { token: "--success" },
      { token: "--success-subtle" },
      { token: "--warning" },
      { token: "--warning-subtle" },
      { token: "--info" },
      { token: "--info-subtle" },
    ],
  },
  {
    title: "Severity",
    note: "Mapped onto status colours; a theme may re-point one without changing the others.",
    tokens: [
      { token: "--severity-critical" },
      { token: "--severity-high" },
      { token: "--severity-medium" },
      { token: "--severity-low" },
    ],
  },
  {
    title: "Data",
    tokens: [
      { token: "--chart-1" },
      { token: "--chart-2" },
      { token: "--chart-3" },
      { token: "--chart-4" },
      { token: "--chart-5" },
    ],
  },
  {
    title: "Sidebar",
    tokens: [
      { token: "--sidebar" },
      { token: "--sidebar-foreground", on: "--sidebar" },
      { token: "--sidebar-primary" },
      { token: "--sidebar-primary-foreground", on: "--sidebar-primary" },
      { token: "--sidebar-accent", on: "--sidebar" },
      { token: "--sidebar-accent-foreground", on: "--sidebar-accent" },
      { token: "--sidebar-border" },
      { token: "--sidebar-ring" },
    ],
  },
]

export const tokenUses = [
  { surface: "page", usage: "--background" },
  { surface: "raised surface", usage: "--card (or --popover for overlays)" },
  { surface: "recessed / quiet block", usage: "--muted" },
  { surface: "primary text", usage: "--foreground" },
  { surface: "de-emphasized text", usage: "--muted-foreground" },
  { surface: "disabled / placeholder", usage: "--subtle-foreground" },
  { surface: "hairline", usage: "--border" },
  { surface: "field outline", usage: "--input" },
  { surface: "focus ring", usage: "--ring" },
  { surface: "one action per view", usage: "--primary / --primary-foreground" },
]

/** Type scale tokens, largest first. */
export const typeScale = [
  "--text-display",
  "--text-heading",
  "--text-title",
  "--text-body",
  "--text-caption",
  "--text-micro",
]

export const typeFamilies = [
  { token: "--font-heading", role: "Headings" },
  { token: "--font-sans", role: "Body and UI" },
  { token: "--font-mono", role: "Code and data" },
]

export const weights = [
  { token: "--font-weight-normal", role: "normal" },
  { token: "--font-weight-medium", role: "medium" },
  { token: "--font-weight-strong", role: "strong" },
]

export const radii = [
  { token: "--radius-item-sm", role: "item-sm" },
  { token: "--radius-item", role: "item" },
  { token: "--radius-control", role: "control" },
  { token: "--radius-floating", role: "floating" },
  { token: "--radius-container", role: "container" },
  { token: "--radius-pill", role: "pill" },
]

export const spacingSteps = [1, 2, 3, 4, 6, 8, 10, 12, 16]

export const controlHeights = [
  "--control-xs",
  "--control-sm",
  "--control-md",
  "--control-lg",
]

export const durations = [
  "--duration-fast",
  "--duration-base",
  "--duration-moderate",
  "--duration-slow",
]

export const easings = [
  { token: "--ease-standard", role: "standard" },
  { token: "--ease-emphasized", role: "emphasized" },
  { token: "--ease-enter", role: "enter" },
  { token: "--ease-exit", role: "exit" },
  { token: "--ease-spring", role: "spring" },
]

export const elevations = [
  { token: "--shadow-raised", role: "raised", note: "cards, menubar" },
  { token: "--shadow-floating", role: "floating", note: "popovers, dropdowns" },
  { token: "--shadow-modal", role: "modal", note: "dialogs, sheets" },
]

export const componentTokens = [
  {
    title: "Buttons",
    tokens: ["--button-radius-xs", "--button-radius-sm"],
  },
  { title: "Badge", tokens: ["--badge-radius"] },
  { title: "Checkbox", tokens: ["--checkbox-radius"] },
  { title: "Textarea", tokens: ["--textarea-radius"] },
  {
    title: "Input",
    tokens: [
      "--input-fill",
      "--input-group-button-radius",
      "--input-group-kbd-radius",
    ],
  },
  { title: "Card", tokens: ["--card-shadow"] },
  { title: "Slider", tokens: ["--slider-thumb-fill"] },
  { title: "Tooltip", tokens: ["--tooltip-arrow-radius"] },
  {
    title: "Chart",
    tokens: ["--chart-indicator-radius", "--chart-tooltip-shadow"],
  },
  {
    title: "Toast",
    tokens: ["--toast-radius", "--toast-duration", "--toast-stack-duration"],
  },
  {
    title: "Timing",
    note: "Component timing also respects reduced motion.",
    tokens: [
      "--drawer-duration",
      "--drawer-release-duration",
      "--message-scroller-duration",
      "--navigation-menu-duration",
    ],
  },
]
