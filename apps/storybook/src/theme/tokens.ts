/*
 * Names and groupings only — never values. The Theme stories read the live
 * cascade, so a page listing "--muted" documents all nine themes, both modes
 * and both densities without a second source of truth.
 */

/**
 * What a theme sets, and everything derived from it. Each derived token
 * carries a note saying what it affects, so the page answers "what will this
 * change?" rather than just listing names. Values are read live from the
 * cascade; nothing here is a copy of a theme.
 */
export type ColorToken = { token: string; note: string }
export type ColorInput = {
  token: string
  group: "Neutrals" | "Brand" | "Status" | "Data" | "Overlay"
  role: string
  tokens: ColorToken[]
}

export const colorInputs: ColorInput[] = [
  {
    token: "--canvas",
    group: "Neutrals",
    role: "The page background. Every tint is mixed against it.",
    tokens: [
      {
        token: "--background",
        note: "The page itself — anything content sits on directly.",
      },
      {
        token: "--muted",
        note: "Quiet fills: badges, table headers, code blocks, skeletons.",
      },
      {
        token: "--subtle-foreground",
        note: "Disabled text and placeholders — the quietest text on a page.",
      },
      {
        token: "--sidebar",
        note: "Sidebar and rail surface, one step off the page.",
      },
      {
        token: "--ring",
        note: "Keyboard focus ring around buttons, inputs and links.",
      },
    ],
  },
  {
    token: "--surface",
    group: "Neutrals",
    role: "Any raised surface: cards, menus, popovers.",
    tokens: [
      {
        token: "--card",
        note: "Raised containers: cards, panels, table shells, tiles.",
      },
      {
        token: "--popover",
        note: "Floating surfaces: menus, popovers, tooltips, command palette, selects.",
      },
      {
        token: "--secondary",
        note: "Secondary buttons, chips, keycaps, segmented controls.",
      },
      {
        token: "--accent",
        note: "Hovered and current items in menus and command lists.",
      },
    ],
  },
  {
    token: "--ink",
    group: "Neutrals",
    role: "Primary text, and the ink that tints every neutral fill.",
    tokens: [
      {
        token: "--foreground",
        note: "Primary text and icons on the page, cards and popovers.",
      },
      { token: "--card-foreground", note: "Text and icons on cards." },
      {
        token: "--popover-foreground",
        note: "Text and icons in menus, popovers and tooltips.",
      },
      {
        token: "--muted",
        note: "Quiet fills, tinted with ink: 4% in light, 15% in dark.",
      },
      {
        token: "--hover",
        note: "Wash under the pointer on rows, menu items and ghost buttons.",
      },
      {
        token: "--active",
        note: "Pressed state, one step stronger than hover.",
      },
      {
        token: "--border-strong",
        note: "Outlines that must read: field borders, menu edges, chosen chips.",
      },
      {
        token: "--sidebar",
        note: "Sidebar surface — ink at 3% (light) or 7% (dark) over the page.",
      },
      {
        token: "--sidebar-accent",
        note: "Hovered item inside the sidebar.",
      },
      {
        token: "--sidebar-foreground",
        note: "Sidebar text and icons.",
      },
      {
        token: "--sidebar-accent-foreground",
        note: "Text on a hovered sidebar item.",
      },
      {
        token: "--secondary-foreground",
        note: "Text and icons on secondary fills.",
      },
      {
        token: "--accent-foreground",
        note: "Text and icons on accent highlights.",
      },
    ],
  },
  {
    token: "--ink-muted",
    group: "Neutrals",
    role: "Secondary text, and the base for disabled text.",
    tokens: [
      {
        token: "--muted-foreground",
        note: "Second-level text: labels, helper text, metadata, inactive items.",
      },
      {
        token: "--subtle-foreground",
        note: "Disabled text and placeholders — muted ink pulled 65% toward the page.",
      },
    ],
  },
  {
    token: "--line",
    group: "Neutrals",
    role: "Every hairline and border.",
    tokens: [
      {
        token: "--border",
        note: "Hairlines: dividers, card and table outlines, row rules.",
      },
      {
        token: "--border-strong",
        note: "Stronger separators, and the base for field borders.",
      },
      {
        token: "--input",
        note: "Form control border at rest (aliases border-strong).",
      },
      {
        token: "--sidebar-border",
        note: "Sidebar dividers and its outer edge.",
      },
    ],
  },
  {
    token: "--brand",
    group: "Brand",
    role: "One brand colour for actions, selection and focus.",
    tokens: [
      {
        token: "--primary",
        note: "Primary buttons, checked boxes/radios/switches, the active tab pill.",
      },
      {
        token: "--primary-subtle",
        note: "Selected rows, active menu items, tinted chips.",
      },
      {
        token: "--primary-border",
        note: "Outline around brand-tinted elements: selected card, avatar ring.",
      },
      {
        token: "--selected",
        note: "Persistent selection: current menu item, chosen row.",
      },
      {
        token: "--ring",
        note: "Focus ring — brand mixed toward the page so it reads on any surface.",
      },
      {
        token: "--sidebar-primary",
        note: "Active item in the sidebar.",
      },
      {
        token: "--sidebar-ring",
        note: "Focus ring inside the sidebar (aliases ring).",
      },
    ],
  },
  {
    token: "--brand-ink",
    group: "Brand",
    role: "Text and icons that sit on the brand colour.",
    tokens: [
      {
        token: "--primary-foreground",
        note: "Text and icons on primary buttons and checked controls.",
      },
      {
        token: "--sidebar-primary-foreground",
        note: "Text and icon on the active sidebar item.",
      },
    ],
  },
  {
    token: "--danger",
    group: "Status",
    role: "Errors and destructive actions.",
    tokens: [
      {
        token: "--destructive",
        note: "Destructive text and icons: delete, remove, validation messages.",
      },
      {
        token: "--danger-subtle",
        note: "Error banners, invalid fields, destructive confirmations.",
      },
      {
        token: "--severity-critical",
        note: "Critical severity dot, chip and row stripe.",
      },
      {
        token: "--severity-high",
        note: "High severity — danger mixed half-and-half with warning.",
      },
    ],
  },
  {
    token: "--warning",
    group: "Status",
    role: "Warnings and attention states.",
    tokens: [
      {
        token: "--warning-subtle",
        note: "Warning banners and rows that need attention.",
      },
      {
        token: "--severity-medium",
        note: "Medium severity dot, chip and row stripe.",
      },
      {
        token: "--severity-high",
        note: "High severity — danger mixed half-and-half with warning.",
      },
    ],
  },
  {
    token: "--success",
    group: "Status",
    role: "Positive outcomes.",
    tokens: [
      {
        token: "--success-subtle",
        note: "Success notices and positive badges.",
      },
      {
        token: "--severity-low",
        note: "Low severity dot, chip and row stripe.",
      },
    ],
  },
  {
    token: "--info",
    group: "Status",
    role: "Informational states.",
    tokens: [
      { token: "--info-subtle", note: "Informational notices and badges." },
    ],
  },
  {
    token: "--chart-1",
    group: "Data",
    role: "Chart series 1 — lightest of the five in Nova.",
    tokens: [],
  },
  {
    token: "--chart-2",
    group: "Data",
    role: "Chart series 2.",
    tokens: [],
  },
  {
    token: "--chart-3",
    group: "Data",
    role: "Chart series 3.",
    tokens: [],
  },
  {
    token: "--chart-4",
    group: "Data",
    role: "Chart series 4.",
    tokens: [],
  },
  {
    token: "--chart-5",
    group: "Data",
    role: "Chart series 5 — darkest of the five in Nova.",
    tokens: [],
  },
  {
    token: "--overlay",
    group: "Overlay",
    role: "The scrim behind dialogs, alert dialogs, sheets and the drawer.",
    tokens: [],
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
