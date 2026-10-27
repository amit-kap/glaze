// The type Studio edits: three typefaces, five text sizes with their line
// spacing, and three weights. Names, labels and notes come from the library
// catalog and the defaults from Nova's CSS, as for colour. Type is shared by
// both modes, so the draft keeps one set. Values are the CSS strings a theme
// exports; the panel reads and writes them through the number helpers below.

import { settings } from "@amit-kap/glaze/theme/catalog"

import { novaRoot } from "./theme"

export type TypeValues = Record<string, string>

export type TypeKind = "font" | "text" | "number" | "weight"

export type TypeRow = {
  token: string
  label: string
  note: string
  kind: TypeKind
}

export type TypeGroup = {
  id: string
  title: string
  note: string
  rows: TypeRow[]
}

const tokenOf = (token: string) => token.replace(/^--/, "")

const groupMeta: Record<string, { title: string; note: string }> = {
  "typography.fonts": {
    title: "Fonts",
    note: "The typefaces for body, headings and code.",
  },
  "typography.size-line-spacing": {
    title: "Size & line spacing",
    note: "Each text size in px, and how tall its lines run.",
  },
  "typography.weight": {
    title: "Weights",
    note: "How strong normal, medium and strong text read.",
  },
}

export const typeGroups: TypeGroup[] = Object.entries(groupMeta).map(
  ([id, meta]) => ({
    id,
    ...meta,
    rows: settings
      .filter((setting) => setting.group === id && setting.source === "input")
      .map((setting) => ({
        token: tokenOf(setting.token),
        label: setting.label,
        note: setting.note,
        kind: (setting.kind === "text" ? "text" : setting.kind) as TypeKind,
      })),
  })
)

export const typeTokens = typeGroups.flatMap((group) =>
  group.rows.map((row) => row.token)
)

const kindOf = Object.fromEntries(
  typeGroups.flatMap((group) => group.rows.map((r) => [r.token, r.kind]))
) as Record<string, TypeKind>

export const typeDefaults: TypeValues = Object.fromEntries(
  typeTokens.map((token) => [token, (novaRoot.get(token) ?? "").trim()])
)

// --- Fonts -----------------------------------------------------------------

export type FontOption = { label: string; value: string }

const sans: FontOption[] = [
  { label: "Geist", value: '"Geist Variable", sans-serif' },
  { label: "Inter", value: '"Inter Variable", sans-serif' },
  { label: "Figtree", value: '"Figtree Variable", sans-serif' },
  { label: "Noto Sans", value: '"Noto Sans Variable", sans-serif' },
  { label: "Playfair Display", value: '"Playfair Display Variable", serif' },
]

const systemMono = typeDefaults["typeface-mono"]

/** The choices per font row; headings may also just follow the body font. */
export const fontOptions: Record<string, FontOption[]> = {
  "typeface-sans": sans,
  "typeface-heading": [
    { label: "Same as body", value: typeDefaults["typeface-heading"] },
    ...sans,
  ],
  "typeface-mono": [
    { label: "System mono", value: systemMono },
    {
      label: "JetBrains Mono",
      value: '"JetBrains Mono Variable", monospace',
    },
  ],
}

// --- Numbers ---------------------------------------------------------------

export const weightOptions = [
  { label: "300", value: "300" },
  { label: "400", value: "400" },
  { label: "500", value: "500" },
  { label: "600", value: "600" },
  { label: "700", value: "700" },
]

const REM = 16

/** A CSS number as the panel shows it: px for sizes, a plain number else. */
export function toNumber(token: string, css: string | undefined): number {
  const text = (css ?? "").trim()
  // Nova writes leading as `calc(a / b)`.
  const ratio = text.match(/^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/)
  if (ratio) return Number(ratio[1]) / Number(ratio[2])
  const rem = text.match(/^([\d.]+)rem$/)
  if (rem) return Number(rem[1]) * REM
  const px = text.match(/^([\d.]+)px$/)
  if (px) return Number(px[1])
  return Number(text)
}

/** The CSS a number is stored and exported as. */
export function toCss(token: string, value: number): string {
  if (kindOf[token] === "text") return `${+(value / REM).toFixed(4)}rem`
  if (kindOf[token] === "number") return `${+value.toFixed(3)}`
  return String(Math.round(value))
}

export function sameType(token: string, a: string, b: string) {
  if (kindOf[token] === "font") return a.trim() === b.trim()
  const tolerance = kindOf[token] === "text" ? 0.01 : 0.001
  return Math.abs(toNumber(token, a) - toNumber(token, b)) < tolerance
}

export const typeChanged = (token: string, value: string) =>
  !sameType(token, value, typeDefaults[token])

export const countTypeChanges = (values: TypeValues) =>
  typeTokens.filter((token) => typeChanged(token, values[token])).length

/** The values a preview scopes to itself. */
export function typeVars(values: TypeValues) {
  return Object.fromEntries(
    typeTokens.map((token) => [`--${token}`, values[token]])
  ) as Record<string, string>
}
