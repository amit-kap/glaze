// Converts stock shadcn/Tailwind classes in packages/ui components to Glaze
// system utilities (spec: "Converting stock shadcn code", step 2).
// Every rule maps a stock class to the token whose default-theme value equals
// it, so the default theme renders identically. Safe to re-run.
// Usage: node scripts/glaze-convert.mjs [component.tsx ...]

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const dir = new URL("../packages/ui/src/components/", import.meta.url).pathname

// Components whose fixed heights are control heights.
const controls = new Set([
  "button", "input", "input-group", "select", "native-select", "combobox",
  "toggle", "tabs", "menubar", "navigation-menu",
])

// A class token: optional variants (anything ending in ':'), optional leading
// '!', the utility, optional trailing '!'.
const B = String.raw`(?<=^|[\s"':!])`
const E = String.raw`(?=$|[\s"'!/])`

const rules = [
  // radius
  [new RegExp(`${B}rounded((?:-[trblse]{1,2})?)-sm${E}`, "g"), "rounded$1-item-sm"],
  [new RegExp(`${B}rounded((?:-[trblse]{1,2})?)-md${E}`, "g"), "rounded$1-item"],
  [new RegExp(`${B}rounded((?:-[trblse]{1,2})?)-lg${E}`, "g"), "rounded$1-control"],
  [new RegExp(`${B}rounded((?:-[trblse]{1,2})?)-xl${E}`, "g"), "rounded$1-container"],
  [new RegExp(`${B}rounded((?:-[trblse]{1,2})?)-full${E}`, "g"), "rounded$1-pill"],
  [/var\(--radius-md\)/g, "var(--radius-item)"],
  // type
  [new RegExp(`${B}text-xs${E}`, "g"), "text-caption"],
  [new RegExp(`${B}text-sm${E}`, "g"), "text-body"],
  // elevation
  [new RegExp(`${B}shadow-sm${E}`, "g"), "shadow-raised"],
  [new RegExp(`${B}shadow-md${E}`, "g"), "shadow-floating"],
  [new RegExp(`${B}shadow-lg${E}`, "g"), "shadow-modal"],
  // motion
  [new RegExp(`${B}duration-100${E}`, "g"), "duration-(--duration-fast)"],
  [new RegExp(`${B}duration-150${E}`, "g"), "duration-(--duration-base)"],
  [new RegExp(`${B}duration-200${E}`, "g"), "duration-(--duration-moderate)"],
  [new RegExp(`${B}duration-300${E}`, "g"), "duration-(--duration-slow)"],
  [new RegExp(`${B}ease-in-out${E}`, "g"), "ease-standard"],
  [new RegExp(`${B}ease-in${E}`, "g"), "ease-exit"],
  // colour
  [new RegExp(`${B}bg-black/10${E}`, "g"), "bg-overlay"],
]

const heights = [
  [new RegExp(`${B}((?:min-)?h|size)-6${E}`, "g"), "$1-control-xs"],
  [new RegExp(`${B}((?:min-)?h|size)-7${E}`, "g"), "$1-control-sm"],
  [new RegExp(`${B}((?:min-)?h|size)-8${E}`, "g"), "$1-control-md"],
  [new RegExp(`${B}((?:min-)?h|size)-9${E}`, "g"), "$1-control-lg"],
]

// text-base stays only as the iOS no-zoom size on inputs (paired with md:text-*).
function convertString(str, isControl) {
  let out = str
  for (const [re, to] of rules) out = out.replace(re, to)
  if (isControl) for (const [re, to] of heights) out = out.replace(re, to)
  if (!/md:text-/.test(out)) out = out.replace(new RegExp(`${B}text-base${E}`, "g"), "text-title")
  return out
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(dir).filter((f) => f.endsWith(".tsx"))

let changed = 0
for (const file of files) {
  const path = join(dir, file.replace(/^.*\//, ""))
  const name = file.replace(/^.*\//, "").replace(/\.tsx$/, "")
  const src = readFileSync(path, "utf8")
  const out = src.replace(/"([^"\n]*)"/g, (m, s) => `"${convertString(s, controls.has(name))}"`)
  if (out !== src) {
    writeFileSync(path, out)
    changed++
  }
}
console.log(`converted ${changed} file(s)`)
