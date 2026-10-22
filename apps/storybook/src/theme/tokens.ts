/** Shared documentation catalog. Values come from the live CSS, not this file. */
export type TokenKind =
  | "color"
  | "font"
  | "text"
  | "weight"
  | "number"
  | "length"
  | "height"
  | "radius"
  | "shadow"
  | "duration"
  | "easing"
export type TokenDoc = {
  token: string
  label: string
  note: string
  kind: TokenKind
  affects?: TokenDoc[]
  fallback?: string
  source?: string
  setting?: boolean
  fixed?: boolean
}
export type TokenGroup = {
  title: string
  note: string
  items: TokenDoc[]
  collapsed?: boolean
}
export type ThemeSection = {
  id: string
  title: string
  note: string
  groups: TokenGroup[]
}

export const themeSections: ThemeSection[] = [
  {
    id: "colors",
    title: "Colors",
    note: "Backgrounds, text, borders, actions and status colors.",
    groups: [
      {
        title: "Surfaces",
        note: "The layers behind your content.",
        items: [
          {
            token: "--canvas",
            label: "Page",
            note: "The page color; also contributes to quiet fills and focus.",
            kind: "color",
            affects: [
              {
                token: "--background",
                label: "background",
                note: "Page background.",
                kind: "color",
              },
              {
                token: "--muted",
                label: "muted",
                note: "Quiet background fill.",
                kind: "color",
              },
              {
                token: "--subtle-foreground",
                label: "subtle-foreground",
                note: "Extra-quiet text color.",
                kind: "color",
              },
              {
                token: "--sidebar",
                label: "sidebar",
                note: "Sidebar background.",
                kind: "color",
              },
              {
                token: "--sidebar-accent",
                label: "sidebar-accent",
                note: "Sidebar item highlight.",
                kind: "color",
              },
              {
                token: "--ring",
                label: "ring",
                note: "Keyboard-focus color.",
                kind: "color",
              },
              {
                token: "--sidebar-ring",
                label: "sidebar-ring",
                note: "Sidebar focus color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--surface",
            label: "Surface",
            note: "Cards and floating panels; also the base of neutral highlights.",
            kind: "color",
            affects: [
              {
                token: "--card",
                label: "card",
                note: "Card fill.",
                kind: "color",
              },
              {
                token: "--popover",
                label: "popover",
                note: "Floating panel fill.",
                kind: "color",
              },
              {
                token: "--secondary",
                label: "secondary",
                note: "Secondary action fill.",
                kind: "color",
              },
              {
                token: "--accent",
                label: "accent",
                note: "Item highlight fill.",
                kind: "color",
              },
            ],
          },
          {
            token: "--overlay",
            label: "Overlay",
            note: "Translucent backdrop behind dialogs, sheets and drawers.",
            kind: "color",
          },
        ],
      },
      {
        title: "Text",
        note: "Colors for reading and emphasis.",
        items: [
          {
            token: "--ink",
            label: "Main text",
            note: "Main text and icons; also tints neutral fills and outlines.",
            kind: "color",
            affects: [
              {
                token: "--foreground",
                label: "foreground",
                note: "Main text and icons.",
                kind: "color",
              },
              {
                token: "--card-foreground",
                label: "card-foreground",
                note: "Text and icons on cards.",
                kind: "color",
              },
              {
                token: "--popover-foreground",
                label: "popover-foreground",
                note: "Text and icons on floating panels.",
                kind: "color",
              },
              {
                token: "--secondary-foreground",
                label: "secondary-foreground",
                note: "Text on secondary fills.",
                kind: "color",
              },
              {
                token: "--accent-foreground",
                label: "accent-foreground",
                note: "Text on highlighted items.",
                kind: "color",
              },
              {
                token: "--sidebar-foreground",
                label: "sidebar-foreground",
                note: "Sidebar text and icons.",
                kind: "color",
              },
              {
                token: "--sidebar-accent-foreground",
                label: "sidebar-accent-foreground",
                note: "Text on sidebar highlights.",
                kind: "color",
              },
              {
                token: "--secondary",
                label: "secondary",
                note: "Secondary action fill.",
                kind: "color",
              },
              {
                token: "--accent",
                label: "accent",
                note: "Item highlight fill.",
                kind: "color",
              },
              {
                token: "--muted",
                label: "muted",
                note: "Quiet background fill.",
                kind: "color",
              },
              {
                token: "--hover",
                label: "hover",
                note: "Pointer-over wash.",
                kind: "color",
              },
              {
                token: "--active",
                label: "active",
                note: "Pressed-state wash.",
                kind: "color",
              },
              {
                token: "--border-strong",
                label: "border-strong",
                note: "Stronger outlines.",
                kind: "color",
              },
              {
                token: "--input",
                label: "input",
                note: "Default field border color.",
                kind: "color",
              },
              {
                token: "--sidebar",
                label: "sidebar",
                note: "Sidebar background.",
                kind: "color",
              },
              {
                token: "--sidebar-accent",
                label: "sidebar-accent",
                note: "Sidebar item highlight.",
                kind: "color",
              },
            ],
          },
          {
            token: "--ink-muted",
            label: "Secondary text",
            note: "Helper text, metadata and quieter labels.",
            kind: "color",
            affects: [
              {
                token: "--muted-foreground",
                label: "muted-foreground",
                note: "Secondary text.",
                kind: "color",
              },
              {
                token: "--subtle-foreground",
                label: "subtle-foreground",
                note: "Extra-quiet text color.",
                kind: "color",
              },
            ],
          },
        ],
      },
      {
        title: "Borders",
        note: "Lines that separate and define elements.",
        items: [
          {
            token: "--line",
            label: "Border",
            note: "Default outlines and the base of stronger field borders.",
            kind: "color",
            affects: [
              {
                token: "--border",
                label: "border",
                note: "Default dividers and outlines.",
                kind: "color",
              },
              {
                token: "--border-strong",
                label: "border-strong",
                note: "Stronger outlines.",
                kind: "color",
              },
              {
                token: "--input",
                label: "input",
                note: "Default field border color.",
                kind: "color",
              },
              {
                token: "--sidebar-border",
                label: "sidebar-border",
                note: "Sidebar dividers.",
                kind: "color",
              },
            ],
          },
        ],
      },
      {
        title: "Brand",
        note: "Primary actions, selection and keyboard focus.",
        items: [
          {
            token: "--brand",
            label: "Brand",
            note: "Primary fills, brand tints and focus colors.",
            kind: "color",
            affects: [
              {
                token: "--primary",
                label: "primary",
                note: "Primary action and checked-control fill.",
                kind: "color",
              },
              {
                token: "--primary-subtle",
                label: "primary-subtle",
                note: "Soft brand tint.",
                kind: "color",
              },
              {
                token: "--primary-border",
                label: "primary-border",
                note: "Translucent brand border.",
                kind: "color",
              },
              {
                token: "--selected",
                label: "selected",
                note: "Brand-tinted selection color.",
                kind: "color",
              },
              {
                token: "--ring",
                label: "ring",
                note: "Keyboard-focus color.",
                kind: "color",
              },
              {
                token: "--sidebar-ring",
                label: "sidebar-ring",
                note: "Sidebar focus color.",
                kind: "color",
              },
              {
                token: "--sidebar-primary",
                label: "sidebar-primary",
                note: "Sidebar primary fill.",
                kind: "color",
              },
            ],
          },
          {
            token: "--brand-ink",
            label: "On brand",
            note: "Text and icons on brand-colored fills.",
            kind: "color",
            affects: [
              {
                token: "--primary-foreground",
                label: "primary-foreground",
                note: "Text and icons on primary fills.",
                kind: "color",
              },
              {
                token: "--sidebar-primary-foreground",
                label: "sidebar-primary-foreground",
                note: "Text on sidebar primary fills.",
                kind: "color",
              },
            ],
          },
        ],
      },
      {
        title: "Status",
        note: "Colors that communicate a result or severity.",
        items: [
          {
            token: "--danger",
            label: "Danger",
            note: "Errors and destructive actions.",
            kind: "color",
            affects: [
              {
                token: "--destructive",
                label: "destructive",
                note: "Destructive action color.",
                kind: "color",
              },
              {
                token: "--danger-subtle",
                label: "danger-subtle",
                note: "Soft error tint.",
                kind: "color",
              },
              {
                token: "--severity-critical",
                label: "severity-critical",
                note: "Critical severity color.",
                kind: "color",
              },
              {
                token: "--severity-high",
                label: "severity-high",
                note: "High severity color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--warning",
            label: "Warning",
            note: "Conditions needing attention.",
            kind: "color",
            affects: [
              {
                token: "--warning-subtle",
                label: "warning-subtle",
                note: "Soft warning tint.",
                kind: "color",
              },
              {
                token: "--severity-medium",
                label: "severity-medium",
                note: "Medium severity color.",
                kind: "color",
              },
              {
                token: "--severity-high",
                label: "severity-high",
                note: "High severity color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--success",
            label: "Success",
            note: "Positive outcomes and low severity.",
            kind: "color",
            affects: [
              {
                token: "--success-subtle",
                label: "success-subtle",
                note: "Soft success tint.",
                kind: "color",
              },
              {
                token: "--severity-low",
                label: "severity-low",
                note: "Low severity color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--info",
            label: "Information",
            note: "Informational notices and indicators.",
            kind: "color",
            affects: [
              {
                token: "--info-subtle",
                label: "info-subtle",
                note: "Soft information tint.",
                kind: "color",
              },
            ],
          },
        ],
      },
      {
        title: "Charts",
        note: "Five color slots; chart configurations choose how to use them.",
        items: [
          {
            token: "--chart-1",
            label: "Series 1",
            note: "Color for chart series 1.",
            kind: "color",
          },
          {
            token: "--chart-2",
            label: "Series 2",
            note: "Color for chart series 2.",
            kind: "color",
          },
          {
            token: "--chart-3",
            label: "Series 3",
            note: "Color for chart series 3.",
            kind: "color",
          },
          {
            token: "--chart-4",
            label: "Series 4",
            note: "Color for chart series 4.",
            kind: "color",
          },
          {
            token: "--chart-5",
            label: "Series 5",
            note: "Color for chart series 5.",
            kind: "color",
          },
        ],
      },
      {
        title: "Advanced mixing",
        note: "Fine-tune derived fills, borders and sidebar colors.",
        items: [
          {
            token: "--mix-fill",
            label: "Fill tint",
            note: "Amount of ink in secondary and item-highlight fills.",
            kind: "number",
            affects: [
              {
                token: "--secondary",
                label: "secondary",
                note: "Secondary action fill.",
                kind: "color",
              },
              {
                token: "--accent",
                label: "accent",
                note: "Item highlight fill.",
                kind: "color",
              },
              {
                token: "--sidebar-accent",
                label: "sidebar-accent",
                note: "Sidebar item highlight.",
                kind: "color",
              },
            ],
          },
          {
            token: "--mix-muted",
            label: "Quiet tint",
            note: "Amount of ink in the quiet background.",
            kind: "number",
            affects: [
              {
                token: "--muted",
                label: "muted",
                note: "Quiet background fill.",
                kind: "color",
              },
            ],
          },
          {
            token: "--mix-sidebar",
            label: "Sidebar tint",
            note: "Amount of ink in the sidebar background.",
            kind: "number",
            affects: [
              {
                token: "--sidebar",
                label: "sidebar",
                note: "Sidebar background.",
                kind: "color",
              },
              {
                token: "--sidebar-accent",
                label: "sidebar-accent",
                note: "Sidebar item highlight.",
                kind: "color",
              },
            ],
          },
          {
            token: "--mix-strong",
            label: "Border tint",
            note: "Amount of ink added to stronger outlines.",
            kind: "number",
            affects: [
              {
                token: "--border-strong",
                label: "border-strong",
                note: "Stronger outlines.",
                kind: "color",
              },
              {
                token: "--input",
                label: "input",
                note: "Default field border color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--mix-ring",
            label: "Focus tint",
            note: "Amount of brand mixed with the page for focus.",
            kind: "number",
            affects: [
              {
                token: "--ring",
                label: "ring",
                note: "Keyboard-focus color.",
                kind: "color",
              },
              {
                token: "--sidebar-ring",
                label: "sidebar-ring",
                note: "Sidebar focus color.",
                kind: "color",
              },
            ],
          },
          {
            token: "--sidebar-brand",
            label: "Sidebar brand",
            note: "Separate sidebar primary fill; falls back to Brand.",
            kind: "color",
            affects: [
              {
                token: "--sidebar-primary",
                label: "sidebar-primary",
                note: "Sidebar primary fill.",
                kind: "color",
              },
            ],
            fallback: "var(--brand)",
          },
          {
            token: "--sidebar-brand-ink",
            label: "On sidebar brand",
            note: "Separate sidebar primary text; falls back to On brand.",
            kind: "color",
            affects: [
              {
                token: "--sidebar-primary-foreground",
                label: "sidebar-primary-foreground",
                note: "Text on sidebar primary fills.",
                kind: "color",
              },
            ],
            fallback: "var(--brand-ink)",
          },
          {
            token: "--caution",
            label: "High severity",
            note: "Separate high-severity color; defaults to danger mixed with warning.",
            kind: "color",
            affects: [
              {
                token: "--severity-high",
                label: "severity-high",
                note: "High severity color.",
                kind: "color",
              },
            ],
            fallback: "color-mix(in oklab, var(--danger) 50%, var(--warning))",
          },
        ],
        collapsed: true,
      },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    note: "Fonts, text sizes, line spacing and weights.",
    groups: [
      {
        title: "Fonts",
        note: "Family is independent of text size and weight.",
        items: [
          {
            token: "--typeface-sans",
            label: "Body & UI",
            note: "Default font for body text and interface labels.",
            kind: "font",
            affects: [
              {
                token: "--font-sans",
                label: "font-sans",
                note: "Default font for body text and interface labels.",
                kind: "font",
              },
            ],
          },
          {
            token: "--typeface-heading",
            label: "Headings",
            note: "Font for elements using the heading family.",
            kind: "font",
            affects: [
              {
                token: "--font-heading",
                label: "font-heading",
                note: "Font for elements using the heading family.",
                kind: "font",
              },
            ],
          },
          {
            token: "--typeface-mono",
            label: "Code & data",
            note: "Font for code and aligned data.",
            kind: "font",
            affects: [
              {
                token: "--font-mono",
                label: "font-mono",
                note: "Font for code and aligned data.",
                kind: "font",
              },
            ],
          },
        ],
      },
      {
        title: "Size & line spacing",
        note: "Size sets the text height; leading sets the space between lines.",
        items: [
          {
            token: "--type-display",
            label: "Display",
            note: "Prominent headings.",
            kind: "text",
            affects: [
              {
                token: "--text-display",
                label: "text-display",
                note: "Prominent headings.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-display-leading",
            label: "Display leading",
            note: "Line-height multiplier for display text.",
            kind: "number",
            affects: [
              {
                token: "--text-display--line-height",
                label: "text-display--line-height",
                note: "Line spacing for display text.",
                kind: "number",
              },
            ],
          },
          {
            token: "--type-heading",
            label: "Heading",
            note: "Larger section headings.",
            kind: "text",
            affects: [
              {
                token: "--text-heading",
                label: "text-heading",
                note: "Larger section headings.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-heading-leading",
            label: "Heading leading",
            note: "Line-height multiplier for heading text.",
            kind: "number",
            affects: [
              {
                token: "--text-heading--line-height",
                label: "text-heading--line-height",
                note: "Line spacing for heading text.",
                kind: "number",
              },
            ],
          },
          {
            token: "--type-title",
            label: "Title",
            note: "Compact titles and component headings.",
            kind: "text",
            affects: [
              {
                token: "--text-title",
                label: "text-title",
                note: "Compact titles and component headings.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-title-leading",
            label: "Title leading",
            note: "Line-height multiplier for title text.",
            kind: "number",
            affects: [
              {
                token: "--text-title--line-height",
                label: "text-title--line-height",
                note: "Line spacing for title text.",
                kind: "number",
              },
            ],
          },
          {
            token: "--type-body",
            label: "Body",
            note: "Main interface text.",
            kind: "text",
            affects: [
              {
                token: "--text-body",
                label: "text-body",
                note: "Main interface text.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-body-leading",
            label: "Body leading",
            note: "Line-height multiplier for body text.",
            kind: "number",
            affects: [
              {
                token: "--text-body--line-height",
                label: "text-body--line-height",
                note: "Line spacing for body text.",
                kind: "number",
              },
            ],
          },
          {
            token: "--type-caption",
            label: "Caption",
            note: "Supporting labels and metadata.",
            kind: "text",
            affects: [
              {
                token: "--text-caption",
                label: "text-caption",
                note: "Supporting labels and metadata.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-caption-leading",
            label: "Caption leading",
            note: "Line-height multiplier for caption text.",
            kind: "number",
            affects: [
              {
                token: "--text-caption--line-height",
                label: "text-caption--line-height",
                note: "Line spacing for caption text.",
                kind: "number",
              },
            ],
          },
          {
            token: "--type-micro",
            label: "Micro",
            note: "Small keycaps and compact labels.",
            kind: "text",
            affects: [
              {
                token: "--text-micro",
                label: "text-micro",
                note: "Small keycaps and compact labels.",
                kind: "text",
              },
            ],
          },
          {
            token: "--type-micro-leading",
            label: "Micro leading",
            note: "Line-height multiplier for micro text.",
            kind: "number",
            affects: [
              {
                token: "--text-micro--line-height",
                label: "text-micro--line-height",
                note: "Line spacing for micro text.",
                kind: "number",
              },
            ],
          },
        ],
      },
      {
        title: "Weight",
        note: "Three levels of emphasis.",
        items: [
          {
            token: "--weight-normal",
            label: "Normal",
            note: "Regular text weight.",
            kind: "weight",
            affects: [
              {
                token: "--font-weight-normal",
                label: "font-weight-normal",
                note: "Regular text weight.",
                kind: "weight",
              },
            ],
          },
          {
            token: "--weight-medium",
            label: "Medium",
            note: "Moderate emphasis.",
            kind: "weight",
            affects: [
              {
                token: "--font-weight-medium",
                label: "font-weight-medium",
                note: "Moderate emphasis.",
                kind: "weight",
              },
            ],
          },
          {
            token: "--weight-strong",
            label: "Strong",
            note: "Strong emphasis.",
            kind: "weight",
            affects: [
              {
                token: "--font-weight-strong",
                label: "font-weight-strong",
                note: "Strong emphasis.",
                kind: "weight",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "spacing",
    title: "Spacing & size",
    note: "Set the rhythm of gaps, padding and control sizes.",
    groups: [
      {
        title: "Spacing",
        note: "One base unit scales spacing throughout the interface.",
        items: [
          {
            token: "--space-base",
            label: "Spacing unit",
            note: "Base unit for padding, gaps and spacing-based dimensions.",
            kind: "length",
            affects: [
              {
                token: "--space",
                label: "space",
                note: "Base spacing multiplied by density.",
                kind: "length",
              },
              {
                token: "--spacing",
                label: "spacing",
                note: "Tailwind spacing unit: p-2 uses two units, gap-3 uses three.",
                kind: "length",
              },
              {
                token: "--control-xs",
                label: "control-xs",
                note: "Standard height minus two spacing units.",
                kind: "height",
              },
              {
                token: "--control-sm",
                label: "control-sm",
                note: "Standard height minus one spacing unit.",
                kind: "height",
              },
              {
                token: "--control-md",
                label: "control-md",
                note: "Standard height after density.",
                kind: "height",
              },
              {
                token: "--control-lg",
                label: "control-lg",
                note: "Standard height plus one spacing unit.",
                kind: "height",
              },
              {
                token: "--switch-width",
                label: "switch-width",
                note: "Default switch track width.",
                kind: "length",
              },
              {
                token: "--switch-height",
                label: "switch-height",
                note: "Default switch track height.",
                kind: "length",
              },
              {
                token: "--switch-thumb",
                label: "switch-thumb",
                note: "Default switch thumb size.",
                kind: "length",
              },
              {
                token: "--switch-width-sm",
                label: "switch-width-sm",
                note: "Small switch track width.",
                kind: "length",
              },
              {
                token: "--switch-height-sm",
                label: "switch-height-sm",
                note: "Small switch track height.",
                kind: "length",
              },
              {
                token: "--switch-thumb-sm",
                label: "switch-thumb-sm",
                note: "Small switch thumb size.",
                kind: "length",
              },
            ],
          },
        ],
      },
      {
        title: "Control heights",
        note: "Set standard height independently; other sizes stay one or two units apart.",
        items: [
          {
            token: "--control-height",
            label: "Default control height",
            note: "Standard height before density; defaults to eight base units.",
            kind: "height",
            affects: [
              {
                token: "--control-xs",
                label: "control-xs",
                note: "Standard height minus two spacing units.",
                kind: "height",
              },
              {
                token: "--control-sm",
                label: "control-sm",
                note: "Standard height minus one spacing unit.",
                kind: "height",
              },
              {
                token: "--control-md",
                label: "control-md",
                note: "Standard height after density.",
                kind: "height",
              },
              {
                token: "--control-lg",
                label: "control-lg",
                note: "Standard height plus one spacing unit.",
                kind: "height",
              },
            ],
            fallback: "calc(var(--space-base) * 8)",
          },
        ],
      },
      {
        title: "Density",
        note: "Comfortable is 1; Compact is 0.875. Type and corners stay unchanged.",
        items: [
          {
            token: "--density",
            label: "Density",
            note: "Multiplies spacing and control sizes; use the toolbar to compare.",
            kind: "number",
            affects: [
              {
                token: "--space",
                label: "space",
                note: "Spacing after density.",
                kind: "length",
              },
              {
                token: "--control-xs",
                label: "control-xs",
                note: "Standard height minus two spacing units.",
                kind: "height",
              },
              {
                token: "--control-sm",
                label: "control-sm",
                note: "Standard height minus one spacing unit.",
                kind: "height",
              },
              {
                token: "--control-md",
                label: "control-md",
                note: "Standard height after density.",
                kind: "height",
              },
              {
                token: "--control-lg",
                label: "control-lg",
                note: "Standard height plus one spacing unit.",
                kind: "height",
              },
              {
                token: "--switch-width",
                label: "switch-width",
                note: "Default switch track width.",
                kind: "length",
              },
              {
                token: "--switch-height",
                label: "switch-height",
                note: "Default switch track height.",
                kind: "length",
              },
              {
                token: "--switch-thumb",
                label: "switch-thumb",
                note: "Default switch thumb size.",
                kind: "length",
              },
              {
                token: "--switch-width-sm",
                label: "switch-width-sm",
                note: "Small switch track width.",
                kind: "length",
              },
              {
                token: "--switch-height-sm",
                label: "switch-height-sm",
                note: "Small switch track height.",
                kind: "length",
              },
              {
                token: "--switch-thumb-sm",
                label: "switch-thumb-sm",
                note: "Small switch thumb size.",
                kind: "length",
              },
            ],
            setting: true,
          },
        ],
      },
    ],
  },
  {
    id: "corners",
    title: "Corners",
    note: "Set overall roundness, then adjust each family if needed.",
    groups: [
      {
        title: "Base radius",
        note: "The starting point; a family override replaces its default.",
        items: [
          {
            token: "--radius",
            label: "Base radius",
            note: "Default roundness across the system.",
            kind: "radius",
            affects: [
              {
                token: "--shape-item",
                label: "shape-item",
                note: "Defaults to 0.8 × base radius.",
                kind: "radius",
              },
              {
                token: "--shape-control",
                label: "shape-control",
                note: "Defaults to base radius.",
                kind: "radius",
              },
              {
                token: "--shape-floating",
                label: "shape-floating",
                note: "Defaults to base radius.",
                kind: "radius",
              },
              {
                token: "--shape-container",
                label: "shape-container",
                note: "Defaults to 1.4 × base radius.",
                kind: "radius",
              },
              {
                token: "--badge-radius",
                label: "badge-radius",
                note: "Badge corners; defaults to 2.6 × base radius.",
                kind: "radius",
              },
              {
                token: "--toast-radius",
                label: "toast-radius",
                note: "Toast corners; defaults to 1.8 × base radius.",
                kind: "radius",
              },
            ],
          },
        ],
      },
      {
        title: "Families",
        note: "Change one family without changing the others.",
        items: [
          {
            token: "--shape-item",
            label: "Item corners",
            note: "Corners of small items inside larger surfaces.",
            kind: "radius",
            affects: [
              {
                token: "--radius-item",
                label: "radius-item",
                note: "Menu-item, tab and tooltip corners.",
                kind: "radius",
              },
              {
                token: "--radius-item-sm",
                label: "radius-item-sm",
                note: "Smaller item corners; 75% of item radius.",
                kind: "radius",
              },
              {
                token: "--button-radius-xs",
                label: "button-radius-xs",
                note: "Extra-small button corners, capped at 10px.",
                kind: "radius",
              },
              {
                token: "--button-radius-sm",
                label: "button-radius-sm",
                note: "Small button corners, capped at 12px.",
                kind: "radius",
              },
              {
                token: "--checkbox-radius",
                label: "checkbox-radius",
                note: "Checkbox corners; half the item radius.",
                kind: "radius",
              },
              {
                token: "--tooltip-arrow-radius",
                label: "tooltip-arrow-radius",
                note: "Tooltip arrow corners; quarter of item radius.",
                kind: "radius",
              },
              {
                token: "--chart-indicator-radius",
                label: "chart-indicator-radius",
                note: "Chart indicator corners; quarter of item radius.",
                kind: "radius",
              },
            ],
          },
          {
            token: "--shape-control",
            label: "Control corners",
            note: "Corners of buttons, inputs, selects and toggles.",
            kind: "radius",
            affects: [
              {
                token: "--radius-control",
                label: "radius-control",
                note: "Shared control corner radius.",
                kind: "radius",
              },
              {
                token: "--textarea-radius",
                label: "textarea-radius",
                note: "Textarea radius, limited by container corners.",
                kind: "radius",
              },
              {
                token: "--input-group-button-radius",
                label: "input-group-button-radius",
                note: "Inset button corners.",
                kind: "radius",
              },
              {
                token: "--input-group-kbd-radius",
                label: "input-group-kbd-radius",
                note: "Inset keycap corners.",
                kind: "radius",
              },
            ],
          },
          {
            token: "--shape-floating",
            label: "Floating corners",
            note: "Corners of menus, popovers and dropdown panels.",
            kind: "radius",
            affects: [
              {
                token: "--radius-floating",
                label: "radius-floating",
                note: "Shared floating-panel radius.",
                kind: "radius",
              },
            ],
          },
          {
            token: "--shape-container",
            label: "Container corners",
            note: "Corners of cards and larger containers.",
            kind: "radius",
            affects: [
              {
                token: "--radius-container",
                label: "radius-container",
                note: "Shared container radius.",
                kind: "radius",
              },
              {
                token: "--textarea-radius",
                label: "textarea-radius",
                note: "Container radius also limits textarea corners.",
                kind: "radius",
              },
            ],
          },
        ],
      },
      {
        title: "Pill",
        note: "A fixed system shape, independent of the base radius.",
        items: [
          {
            token: "--radius-pill",
            label: "Pill",
            note: "Fully rounded ends for avatars, switches and dots.",
            kind: "radius",
            fixed: true,
          },
        ],
      },
    ],
  },
  {
    id: "shadows",
    title: "Shadows",
    note: "Three shared levels of depth for surfaces.",
    groups: [
      {
        title: "Shared levels",
        note: "Each level maps to a shadow utility.",
        items: [
          {
            token: "--elevation-raised",
            label: "Raised",
            note: "Small lift for tab indicators and sidebar surfaces.",
            kind: "shadow",
            affects: [
              {
                token: "--shadow-raised",
                label: "shadow-raised",
                note: "Small lift for tab indicators and sidebar surfaces.",
                kind: "shadow",
              },
            ],
          },
          {
            token: "--elevation-floating",
            label: "Floating",
            note: "Separation for menus, selects, popovers and hover cards.",
            kind: "shadow",
            affects: [
              {
                token: "--shadow-floating",
                label: "shadow-floating",
                note: "Separation for menus, selects, popovers and hover cards.",
                kind: "shadow",
              },
            ],
          },
          {
            token: "--elevation-modal",
            label: "Modal",
            note: "Stronger separation for sheets, toasts and some menu panels.",
            kind: "shadow",
            affects: [
              {
                token: "--shadow-modal",
                label: "shadow-modal",
                note: "Stronger separation for sheets, toasts and some menu panels.",
                kind: "shadow",
              },
            ],
          },
        ],
      },
      {
        title: "Component exceptions",
        note: "These shadows are independent of the shared scale.",
        items: [
          {
            token: "--card-shadow",
            label: "Card shadow",
            note: "Card depth; defaults to no shadow.",
            kind: "shadow",
          },
          {
            token: "--chart-tooltip-shadow",
            label: "Chart tooltip shadow",
            note: "Depth of the chart tooltip.",
            kind: "shadow",
          },
        ],
      },
    ],
  },
  {
    id: "motion",
    title: "Motion",
    note: "Control how quickly things change and how they move.",
    groups: [
      {
        title: "Duration",
        note: "Inputs set the pace; derived timings account for reduced motion.",
        items: [
          {
            token: "--motion-fast",
            label: "Fast",
            note: "Quick, small changes.",
            kind: "duration",
            affects: [
              {
                token: "--duration-fast",
                label: "duration-fast",
                note: "Movement timing after motion scaling.",
                kind: "duration",
              },
              {
                token: "--duration-fade-fast",
                label: "duration-fade-fast",
                note: "Fade timing; retained under reduced motion.",
                kind: "duration",
              },
              {
                token: "--duration-exit-fast",
                label: "duration-exit-fast",
                note: "Shorter fade timing for leaving elements.",
                kind: "duration",
              },
            ],
          },
          {
            token: "--motion-base",
            label: "Base",
            note: "Everyday state transitions.",
            kind: "duration",
            affects: [
              {
                token: "--duration-base",
                label: "duration-base",
                note: "Movement timing after motion scaling.",
                kind: "duration",
              },
              {
                token: "--duration-fade-base",
                label: "duration-fade-base",
                note: "Fade timing; retained under reduced motion.",
                kind: "duration",
              },
              {
                token: "--duration-exit-base",
                label: "duration-exit-base",
                note: "Shorter fade timing for leaving elements.",
                kind: "duration",
              },
            ],
          },
          {
            token: "--motion-moderate",
            label: "Moderate",
            note: "Noticeable travel and resizing.",
            kind: "duration",
            affects: [
              {
                token: "--duration-moderate",
                label: "duration-moderate",
                note: "Movement timing after motion scaling.",
                kind: "duration",
              },
              {
                token: "--duration-fade-moderate",
                label: "duration-fade-moderate",
                note: "Fade timing; retained under reduced motion.",
                kind: "duration",
              },
              {
                token: "--duration-exit-moderate",
                label: "duration-exit-moderate",
                note: "Shorter fade timing for leaving elements.",
                kind: "duration",
              },
            ],
          },
          {
            token: "--motion-slow",
            label: "Slow",
            note: "Longer transitions.",
            kind: "duration",
            affects: [
              {
                token: "--duration-slow",
                label: "duration-slow",
                note: "Movement timing after motion scaling.",
                kind: "duration",
              },
            ],
          },
        ],
      },
      {
        title: "Easing",
        note: "The speed pattern during a transition. Play each curve to compare.",
        items: [
          {
            token: "--motion-ease-linear",
            label: "Linear",
            note: "Constant speed.",
            kind: "easing",
            affects: [
              {
                token: "--ease-linear",
                label: "ease-linear",
                note: "Constant speed.",
                kind: "easing",
              },
            ],
          },
          {
            token: "--motion-ease-standard",
            label: "Standard",
            note: "Smooth acceleration and deceleration.",
            kind: "easing",
            affects: [
              {
                token: "--ease-standard",
                label: "ease-standard",
                note: "Smooth acceleration and deceleration.",
                kind: "easing",
              },
            ],
          },
          {
            token: "--motion-ease-emphasized",
            label: "Emphasized",
            note: "Expressive movement that can overshoot.",
            kind: "easing",
            affects: [
              {
                token: "--ease-emphasized",
                label: "ease-emphasized",
                note: "Expressive movement that can overshoot.",
                kind: "easing",
              },
            ],
          },
          {
            token: "--motion-ease-enter",
            label: "Enter",
            note: "Arrives quickly and settles.",
            kind: "easing",
            affects: [
              {
                token: "--ease-enter",
                label: "ease-enter",
                note: "Arrives quickly and settles.",
                kind: "easing",
              },
            ],
          },
          {
            token: "--motion-ease-exit",
            label: "Exit",
            note: "Accelerates away.",
            kind: "easing",
            affects: [
              {
                token: "--ease-exit",
                label: "ease-exit",
                note: "Accelerates away.",
                kind: "easing",
              },
            ],
          },
          {
            token: "--motion-ease-spring",
            label: "Spring",
            note: "Overshoots and settles with spring-like movement.",
            kind: "easing",
            affects: [
              {
                token: "--ease-spring",
                label: "ease-spring",
                note: "Overshoots and settles with spring-like movement.",
                kind: "easing",
              },
            ],
          },
        ],
      },
      {
        title: "Exit timing",
        note: "Dismissals usually finish sooner than entrances.",
        items: [
          {
            token: "--motion-exit-scale",
            label: "Exit ratio",
            note: "Exit fade duration as a share of entrance; default 0.75.",
            kind: "number",
            affects: [
              {
                token: "--duration-exit-fast",
                label: "duration-exit-fast",
                note: "Exit fade timing for fast transitions.",
                kind: "duration",
              },
              {
                token: "--duration-exit-base",
                label: "duration-exit-base",
                note: "Exit fade timing for base transitions.",
                kind: "duration",
              },
              {
                token: "--duration-exit-moderate",
                label: "duration-exit-moderate",
                note: "Exit fade timing for moderate transitions.",
                kind: "duration",
              },
            ],
          },
        ],
      },
      {
        title: "Reduced motion",
        note: "The system stops travel while keeping popup fades.",
        items: [
          {
            token: "--motion-scale",
            label: "Movement scale",
            note: "Becomes zero when reduced motion is requested.",
            kind: "number",
            affects: [
              {
                token: "--duration-fast",
                label: "duration-fast",
                note: "Scaled fast movement timing.",
                kind: "duration",
              },
              {
                token: "--duration-base",
                label: "duration-base",
                note: "Scaled base movement timing.",
                kind: "duration",
              },
              {
                token: "--duration-moderate",
                label: "duration-moderate",
                note: "Scaled moderate movement timing.",
                kind: "duration",
              },
              {
                token: "--duration-slow",
                label: "duration-slow",
                note: "Scaled slow movement timing.",
                kind: "duration",
              },
              {
                token: "--toast-duration",
                label: "toast-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
              {
                token: "--toast-stack-duration",
                label: "toast-stack-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
              {
                token: "--drawer-duration",
                label: "drawer-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
              {
                token: "--drawer-release-duration",
                label: "drawer-release-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
              {
                token: "--message-scroller-duration",
                label: "message-scroller-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
              {
                token: "--navigation-menu-duration",
                label: "navigation-menu-duration",
                note: "Scaled component transition timing.",
                kind: "duration",
              },
            ],
            setting: true,
          },
          {
            token: "--fade-scale",
            label: "Fade scale",
            note: "Separate fade multiplier; stays at one under reduced motion.",
            kind: "number",
            affects: [
              {
                token: "--duration-fade-fast",
                label: "duration-fade-fast",
                note: "Entrance fade timing.",
                kind: "duration",
              },
              {
                token: "--duration-fade-base",
                label: "duration-fade-base",
                note: "Entrance fade timing.",
                kind: "duration",
              },
              {
                token: "--duration-fade-moderate",
                label: "duration-fade-moderate",
                note: "Entrance fade timing.",
                kind: "duration",
              },
              {
                token: "--duration-exit-fast",
                label: "duration-exit-fast",
                note: "Exit fade timing.",
                kind: "duration",
              },
              {
                token: "--duration-exit-base",
                label: "duration-exit-base",
                note: "Exit fade timing.",
                kind: "duration",
              },
              {
                token: "--duration-exit-moderate",
                label: "duration-exit-moderate",
                note: "Exit fade timing.",
                kind: "duration",
              },
            ],
            setting: true,
          },
        ],
      },
    ],
  },
  {
    id: "components",
    title: "Component details",
    note: "Adjust one component without changing its whole family.",
    groups: [
      {
        title: "Buttons",
        note: "Corners of the smaller button sizes.",
        items: [
          {
            token: "--button-radius-xs",
            label: "Extra-small corners",
            note: "Corners of extra-small buttons; also used by small inputs.",
            kind: "radius",
            source: "min(--shape-item, 10px)",
          },
          {
            token: "--button-radius-sm",
            label: "Small corners",
            note: "Corners of small buttons.",
            kind: "radius",
            source: "min(--shape-item, 12px)",
          },
        ],
      },
      {
        title: "Badge",
        note: "The badge outline.",
        items: [
          {
            token: "--badge-radius",
            label: "Corners",
            note: "Rounding of badge corners.",
            kind: "radius",
            source: "--radius × 2.6",
          },
        ],
      },
      {
        title: "Fields",
        note: "Fills and inset corners in form controls.",
        items: [
          {
            token: "--checkbox-radius",
            label: "Checkbox corners",
            note: "Checkbox corner rounding.",
            kind: "radius",
            source: "--shape-item × 0.5",
          },
          {
            token: "--textarea-radius",
            label: "Textarea corners",
            note: "Textarea corner rounding.",
            kind: "radius",
            source: "min(--shape-control, --shape-container)",
          },
          {
            token: "--input-fill",
            label: "Field fill",
            note: "Default input, textarea and input-group fill; dark styles may replace it.",
            kind: "color",
            source: "transparent",
          },
          {
            token: "--input-group-button-radius",
            label: "Inset button corners",
            note: "Button corners inside an input group.",
            kind: "radius",
            source: "max(0px, --shape-control − 3px)",
          },
          {
            token: "--input-group-kbd-radius",
            label: "Inset keycap corners",
            note: "Keycap corners inside an input group.",
            kind: "radius",
            source: "max(0px, --shape-control − 5px)",
          },
        ],
      },
      {
        title: "Switch",
        note: "Track and thumb sizes follow spacing and density.",
        items: [
          {
            token: "--switch-width",
            label: "Width",
            note: "Default switch track width.",
            kind: "length",
            source: "--space × 8",
          },
          {
            token: "--switch-height",
            label: "Height",
            note: "Default switch track height.",
            kind: "length",
            source: "--space × 4.6",
          },
          {
            token: "--switch-thumb",
            label: "Thumb",
            note: "Default switch thumb size.",
            kind: "length",
            source: "--space × 4",
          },
          {
            token: "--switch-width-sm",
            label: "Width Sm",
            note: "Small switch track width.",
            kind: "length",
            source: "--space × 6",
          },
          {
            token: "--switch-height-sm",
            label: "Height Sm",
            note: "Small switch track height.",
            kind: "length",
            source: "--space × 3.5",
          },
          {
            token: "--switch-thumb-sm",
            label: "Thumb Sm",
            note: "Small switch thumb size.",
            kind: "length",
            source: "--space × 3",
          },
        ],
      },
      {
        title: "Card",
        note: "Card depth is separate from the shared shadow scale.",
        items: [
          {
            token: "--card-shadow",
            label: "Shadow",
            note: "Shadow beneath cards.",
            kind: "shadow",
            source: "no shadow",
          },
        ],
      },
      {
        title: "Slider",
        note: "The draggable handle.",
        items: [
          {
            token: "--slider-thumb-fill",
            label: "Handle fill",
            note: "Fill of the slider handle.",
            kind: "color",
            source: "white",
          },
        ],
      },
      {
        title: "Tooltip",
        note: "The small pointer attached to a tooltip.",
        items: [
          {
            token: "--tooltip-arrow-radius",
            label: "Arrow corners",
            note: "Rounding of the tooltip arrow.",
            kind: "radius",
            source: "--shape-item × 0.25",
          },
        ],
      },
      {
        title: "Chart",
        note: "Details inside chart legends and tooltips.",
        items: [
          {
            token: "--chart-indicator-radius",
            label: "Indicator corners",
            note: "Corners of chart indicators.",
            kind: "radius",
            source: "--shape-item × 0.25",
          },
          {
            token: "--chart-tooltip-shadow",
            label: "Tooltip shadow",
            note: "Shadow beneath chart tooltips.",
            kind: "shadow",
            source: "independent shadow",
          },
        ],
      },
      {
        title: "Toast",
        note: "Notification corners and transitions.",
        items: [
          {
            token: "--toast-radius",
            label: "Corners",
            note: "Toast corner rounding.",
            kind: "radius",
            source: "--radius × 1.8",
          },
          {
            token: "--toast-duration",
            label: "Content timing",
            note: "Toast content opacity transition.",
            kind: "duration",
            source: "250ms × --motion-scale",
          },
          {
            token: "--toast-stack-duration",
            label: "Stack timing",
            note: "Movement and resizing of stacked toasts.",
            kind: "duration",
            source: "500ms × --motion-scale",
          },
        ],
      },
      {
        title: "Drawer",
        note: "Panel and backdrop transitions.",
        items: [
          {
            token: "--drawer-duration",
            label: "Transition timing",
            note: "Drawer opening and closing timing.",
            kind: "duration",
            source: "450ms × --motion-scale",
          },
          {
            token: "--drawer-release-duration",
            label: "Release timing",
            note: "Timing after releasing a swipe.",
            kind: "duration",
            source: "400ms × --motion-scale",
          },
          {
            token: "--drawer-overlay-ease",
            label: "Backdrop easing",
            note: "Backdrop opacity easing.",
            kind: "easing",
            source: "independent curve",
          },
          {
            token: "--drawer-content-ease",
            label: "Content easing",
            note: "Content opacity easing in nested drawers.",
            kind: "easing",
            source: "independent curve",
          },
        ],
      },
      {
        title: "Message scroller",
        note: "Navigation-button transitions.",
        items: [
          {
            token: "--message-scroller-duration",
            label: "Exit timing",
            note: "Navigation-button exit duration.",
            kind: "duration",
            source: "400ms × --motion-scale",
          },
          {
            token: "--message-scroller-ease-exit",
            label: "Exit easing",
            note: "Navigation-button exit curve.",
            kind: "easing",
            source: "independent curve",
          },
        ],
      },
      {
        title: "Navigation menu",
        note: "Transitions between menu panels.",
        items: [
          {
            token: "--navigation-menu-duration",
            label: "Transition timing",
            note: "Navigation-menu animation duration.",
            kind: "duration",
            source: "350ms × --motion-scale",
          },
        ],
      },
    ],
  },
]
