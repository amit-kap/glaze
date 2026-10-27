// The motion Studio edits: four durations, six easing curves and the exit
// ratio. Names, labels and notes come from the library catalog; the defaults
// come from Nova and from the kit's tokens, so there is no second copy of
// either. Motion is shared by both modes, so the draft keeps one set. Values
// are the CSS strings a theme exports.

import tokensCss from "@amit-kap/glaze/tokens.css?raw"
import { settingGroups, settings } from "@amit-kap/glaze/theme/catalog"

import { declarations, novaRoot } from "./theme"

export type MotionValues = Record<string, string>

export type MotionKind = "duration" | "easing" | "number"

export type MotionRow = {
  token: string
  label: string
  note: string
  kind: MotionKind
}

export type MotionGroup = {
  id: string
  title: string
  note: string
  rows: MotionRow[]
}

const tokenOf = (token: string) => token.replace(/^--/, "")
const squash = (css: string) => css.trim().replace(/\s+/g, " ")

// The groups a theme sets, in the catalog's own order. The reduced-motion
// group is runtime state and has its own row in the panel.
const groupIds = ["motion.duration", "motion.easing", "motion.exit-timing"]

export const motionGroups: MotionGroup[] = groupIds.map((id) => {
  const group = settingGroups.find((item) => item.id === id)
  return {
    id,
    title: group?.title ?? id,
    note: group?.note ?? "",
    rows: settings
      .filter((setting) => setting.group === id && setting.source === "input")
      .map((setting) => ({
        token: tokenOf(setting.token),
        label: setting.label,
        note: setting.note,
        kind: setting.kind === "number" ? "number" : setting.kind,
      })) as MotionRow[],
  }
})

export const reducedMotionGroup = settingGroups.find(
  (item) => item.id === "motion.reduced-motion"
)

export const motionTokens = motionGroups.flatMap((group) =>
  group.rows.map((row) => row.token)
)

const kindOf = Object.fromEntries(
  motionGroups.flatMap((group) => group.rows.map((r) => [r.token, r.kind]))
) as Record<string, MotionKind>

// Nova sets the durations and curves; the kit supplies the exit ratio.
const kitRoot = declarations(tokensCss, tokensCss.indexOf(":where(:root) {"))

export const motionDefaults: MotionValues = Object.fromEntries(
  motionTokens.map((token) => [
    token,
    squash(novaRoot.get(token) ?? kitRoot.get(token) ?? ""),
  ])
)

// --- Durations -------------------------------------------------------------

/** A CSS time in milliseconds. */
export function toMs(css: string | undefined): number {
  const text = (css ?? "").trim()
  if (text.endsWith("ms")) return parseFloat(text)
  if (text.endsWith("s")) return parseFloat(text) * 1000
  return Number(text) || 0
}

export const msToCss = (ms: number) => `${Math.round(ms)}ms`

// --- Easing curves ---------------------------------------------------------

export type Bezier = [number, number, number, number]

export type Easing =
  | { kind: "bezier"; p: Bezier }
  | { kind: "points"; points: [number, number][] }
  | { kind: "unknown" }

/**
 * An easing as the panel edits it: a cubic Bézier (`linear` is its straight
 * line), or the list of points of a `linear(...)` curve such as the spring.
 */
export function parseEasing(css: string): Easing {
  const text = squash(css)
  if (text === "linear") return { kind: "bezier", p: [0, 0, 1, 1] }

  const bezier = text.match(/^cubic-bezier\(([^)]*)\)$/)
  if (bezier) {
    const p = bezier[1].split(",").map((n) => parseFloat(n))
    if (p.length === 4 && p.every(Number.isFinite))
      return { kind: "bezier", p: p as Bezier }
  }

  const stops = text.match(/^linear\((.*)\)$/)
  if (stops) {
    const entries = stops[1].split(",").map((entry) => {
      const [value, position] = entry.trim().split(/\s+/)
      return {
        y: parseFloat(value),
        at: position?.endsWith("%") ? parseFloat(position) / 100 : null,
      }
    })
    // A stop without a position sits halfway between its neighbours.
    entries[0].at ??= 0
    entries[entries.length - 1].at ??= 1
    for (let i = 1; i < entries.length - 1; i++) {
      if (entries[i].at !== null) continue
      const next = entries.findIndex((e, j) => j > i && e.at !== null)
      const from = entries[i - 1].at as number
      const to = entries[next].at as number
      const gap = next - (i - 1)
      for (let j = i; j < next; j++)
        entries[j].at = from + ((to - from) * (j - (i - 1))) / gap
    }
    return {
      kind: "points",
      points: entries.map((e) => [e.at as number, e.y]),
    }
  }

  return { kind: "unknown" }
}

export const formatBezier = (p: Bezier) =>
  `cubic-bezier(${p.map((n) => +n.toFixed(3)).join(", ")})`

/** The curve as points to draw, from 0 to 1 in time. */
export function curvePoints(css: string): [number, number][] {
  const easing = parseEasing(css)
  if (easing.kind === "points") return easing.points
  if (easing.kind !== "bezier") return []
  const [x1, y1, x2, y2] = easing.p
  const at = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3
  return Array.from({ length: 41 }, (_, i) => {
    const t = i / 40
    return [at(t, x1, x2), at(t, y1, y2)] as [number, number]
  })
}

// --- Comparing -------------------------------------------------------------

export function sameMotion(token: string, a: string, b: string) {
  if (squash(a) === squash(b)) return true
  if (kindOf[token] === "duration") return Math.abs(toMs(a) - toMs(b)) < 0.5
  if (kindOf[token] === "number")
    return Math.abs(parseFloat(a) - parseFloat(b)) < 0.001
  const first = parseEasing(a)
  const second = parseEasing(b)
  return (
    first.kind === "bezier" &&
    second.kind === "bezier" &&
    first.p.every((n, i) => Math.abs(n - second.p[i]) < 0.005)
  )
}

export const motionChanged = (token: string, value: string) =>
  !sameMotion(token, value, motionDefaults[token])

export const countMotionChanges = (values: MotionValues) =>
  motionTokens.filter((token) => motionChanged(token, values[token])).length

/** The values a preview scopes to itself. */
export function motionVars(values: MotionValues) {
  return Object.fromEntries(
    motionTokens.map((token) => [`--${token}`, values[token]])
  ) as Record<string, string>
}
