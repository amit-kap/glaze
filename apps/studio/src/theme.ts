// The colours Studio edits. Names, labels, notes and order come from the
// library catalog; the defaults are read from Nova's own CSS, so there is no
// second copy of either. A colour is kept as the CSS string the picker emits
// and compared by parsed value, not by text.

import novaCss from "@amit-kap/glaze/themes/nova.css?raw"
import {
  formatColor,
  parseColor,
  relativeLuminance,
  type Rgba,
} from "@amit-kap/glaze/lib/color"
import { dependentsOf, settings } from "@amit-kap/glaze/theme/catalog"
import { settingConsumers } from "@amit-kap/glaze/theme/consumers"

export type Mode = "light" | "dark"

/** A CSS colour string: hex, rgb(), hsl() or oklch(). */
export type Color = string

export type Theme = Record<Mode, Record<string, Color>>

// --- Defaults, read from Nova ---------------------------------------------

// The two blocks that carry colour: `:where(:root)` and `.dark`. Nova writes
// every value twice rather than deriving one mode from the other.
export function declarations(source: string, start: number) {
  const open = source.indexOf("{", start)
  const close = source.indexOf("}", open)
  const body = source.slice(open + 1, close)
  return new Map(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
      ([, token, value]) => [token.replace(/^--/, ""), value.trim()] as const
    )
  )
}

const nova = {
  light: declarations(novaCss, novaCss.indexOf(":where(:root)")),
  dark: declarations(novaCss, novaCss.indexOf(":where(.dark)")),
}

/** Nova's `:root` declarations, for the sections that read non-colour defaults. */
export const novaRoot = nova.light

/** Any colour, written the one way Studio stores and exports them. */
export function canonical(css: string | undefined): Color {
  const parsed = css ? parseColor(css) : null
  return parsed ? formatColor(parsed, "oklch") : (css ?? "")
}

// --- The rows ------------------------------------------------------------

export type Row = {
  token: string
  label: string
  note: string
  /** Tokens that read this one; the drill-down under the picker. */
  feeds: string[]
  /** Components that read the token, from the generated consumer map. */
  usedBy: number
}

export type Group = {
  id: string
  title: string
  note: string
  collapsed: boolean
  rows: Row[]
}

type GroupMeta = { title: string; note: string; collapsed?: boolean }

// Panel order. The catalog's own array puts identity last; a theme is judged
// on identity first, so Brand leads.
const groupMeta: Record<string, GroupMeta> = {
  "colors.brand": {
    title: "Brand",
    note: "Identity color, separate from actions.",
  },
  "colors.surfaces": {
    title: "Surfaces",
    note: "The layers behind your content.",
  },
  "colors.fills": {
    title: "Fills",
    note: "Quiet fills for secondary actions and muted areas.",
  },
  "colors.text": { title: "Text", note: "Colours for reading and emphasis." },
  "colors.borders": {
    title: "Borders",
    note: "Lines that separate and define elements.",
  },
  "colors.status": {
    title: "Status",
    note: "Colours that communicate a result or severity.",
    collapsed: true,
  },
  "colors.charts": {
    title: "Charts",
    note: "",
    collapsed: true,
  },
}

const tokenOf = (token: string) => token.replace(/^--/, "")

// Every colour the catalog lets a theme set, grouped for the panel. Colour
// inputs without a group (`--sidebar-accent`, the `*-foreground` aliases) are
// reachable through the tokens their source feeds instead of as rows.
const editable = settings.filter(
  (setting) =>
    setting.kind === "color" &&
    setting.source === "input" &&
    Boolean(setting.group && setting.group in groupMeta)
)

export const groups: Group[] = Object.entries(groupMeta)
  .map(([id, meta]) => ({
    id,
    title: meta.title,
    note: meta.note,
    collapsed: meta.collapsed ?? false,
    rows: editable
      .filter((setting) => setting.group === id)
      .map((setting) => {
        const token = tokenOf(setting.token)
        return {
          token,
          label: setting.label,
          note: setting.note,
          feeds: dependentsOf(setting.token).map((s) => tokenOf(s.token)),
          usedBy: settingConsumers[setting.token]?.length ?? 0,
        }
      }),
  }))
  .filter((group) => group.rows.length > 0)

/** Every token a colour row can write, in panel order. */
export const tokens = groups.flatMap((group) => group.rows.map((r) => r.token))

// Nova repeats most colours in the dark block, but inherits the rest from
// `:root` (charts, for one), so dark is built on top of light. Only the rows
// exist here: Nova also sets shape, type and motion, which other sections own.
export const defaults: Theme = {
  light: Object.fromEntries(
    tokens.map((token) => [token, canonical(nova.light.get(token))])
  ),
  dark: Object.fromEntries(
    tokens.map((token) => [
      token,
      canonical(nova.dark.get(token) ?? nova.light.get(token)),
    ])
  ),
}

/** How each row is named, for the drill-down and the changes list. */
export const rowOf = Object.fromEntries(
  groups.flatMap((group) => group.rows.map((row) => [row.token, row]))
) as Record<string, Row>

// --- Following -----------------------------------------------------------

/**
 * An action colour tracks its identity colour until it is set on its own.
 * `follows[token]` is the row whose value this one copies.
 */
export const follows: Record<string, string> = {
  "brand-ink": "brand",
  primary: "brand",
  "primary-foreground": "brand-ink",
}

// --- Ink -----------------------------------------------------------------

const inks = {
  light: canonical("oklch(0.985 0 0)"),
  dark: canonical("oklch(0.205 0 0)"),
}

/** The readable partner for a fill: Nova's own two ends, by luminance. */
export function autoInk(background: Color): Color {
  const parsed = parseColor(background)
  if (!parsed) return inks.light
  return relativeLuminance(parsed) < 0.4 ? inks.light : inks.dark
}

// --- Comparing -----------------------------------------------------------

const close = (a = 1, b = 1) => Math.abs(a - b) < 0.004

export function sameColor(a: Color | undefined, b: Color | undefined) {
  if (a === b) return true
  const first = a ? parseColor(a) : null
  const second = b ? parseColor(b) : null
  if (!first || !second) return false
  return (
    close(first.r, second.r) &&
    close(first.g, second.g) &&
    close(first.b, second.b) &&
    close(first.a, second.a)
  )
}

export const changed = (mode: Mode, token: string, value: Color) =>
  !sameColor(value, defaults[mode][token])

/** How many values differ from Nova, across both modes. */
export function countChanges(theme: Theme) {
  let n = 0
  for (const mode of ["light", "dark"] as const)
    for (const token of tokens)
      if (changed(mode, token, theme[mode][token])) n++
  return n
}

/** The values a preview scopes to itself. */
export function cssVars(colors: Record<string, Color>) {
  return Object.fromEntries(
    tokens.map((token) => [`--${token}`, colors[token]])
  ) as Record<string, string>
}

export type { Rgba }
