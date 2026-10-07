// Fails when a component in packages/ui uses a class the token contract
// forbids (spec: "Writing components"). Components listed in ALLOWLIST are
// not converted yet; the list only shrinks.
// Usage: node scripts/glaze-check.mjs

import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const dir = new URL("../packages/ui/src/components/", import.meta.url).pathname

const ALLOWLIST = new Set([])

const B = String.raw`(?<=^|[\s"':!])`
const E = String.raw`(?=$|[\s"'!/])`
const forbidden = [
  [`rounded(?:-[trblse]{1,2})?-(?:xs|sm|md|lg|xl|2xl|3xl|4xl|full)`, "use rounded-item / -control / -floating / -container / -pill"],
  [`rounded(?:-[trblse]{1,2})?-\\[(?!inherit\\])[^\\]]*\\]`, "use a family radius or a component token"],
  [`text-(?:xs|sm|lg|xl|[2-9]xl)`, "use text-caption / -body / -title / -heading / -display"],
  [`font-(?:semibold|bold|extrabold|black)`, "use font-strong"],
  [`shadow-(?:2xs|xs|sm|md|lg|xl|2xl)`, "use shadow-raised / -floating / -modal"],
  [`duration-(?!0\\b)\\d+`, "use duration-(--duration-*) or a component token"],
  [`ease-(?:in|out|in-out)`, "use ease-standard / -emphasized / -exit"],
  [`(?:bg|text|border|ring|fill|stroke|outline|from|to|via)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d+)`, "use colour system tokens"],
].map(([re, hint]) => [new RegExp(`${B}${re}${E}`, "g"), hint])

// Deliberate exceptions, each with its reason.
const exceptions = [
  [/duration-1000/, "input-otp caret blink: a fixed cursor rhythm, not a theme decision"],
]

let problems = 0
for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort()) {
  if (ALLOWLIST.has(file)) continue
  const lines = readFileSync(join(dir, file), "utf8").split("\n")
  lines.forEach((line, i) => {
    // cn must come from lib/utils, which knows the Glaze utilities; the bare
    // package merges text-body away as if it were a colour.
    if (/from "cn"/.test(line)) {
      console.log(`${file}:${i + 1}  import from "cn"  → import { cn } from "@amit-kap/glaze/lib/utils"`)
      problems++
    }
    for (const [re, hint] of forbidden) {
      for (const m of line.matchAll(re)) {
        if (exceptions.some(([ex]) => ex.test(m[0]))) continue
        console.log(`${file}:${i + 1}  ${m[0]}  → ${hint}`)
        problems++
      }
    }
  })
}

if (problems) {
  console.error(`\n${problems} forbidden class(es). See the spec's "Writing components".`)
  process.exit(1)
}
console.log("Token check passed.")
