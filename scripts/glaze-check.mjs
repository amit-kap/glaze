// Fails when a component in packages/ui uses a class the token contract
// forbids (spec: "Writing components"). Components listed in ALLOWLIST are
// not converted yet; the list only shrinks.
//
// Stories and the showcase are held to the same contract, since they are the
// code people copy into real UIs. There only class strings are checked
// (className values and cn/cva/clsx arguments), so prose is ignored.
// Usage: node scripts/glaze-check.mjs

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import ts from "typescript"

const root = new URL("..", import.meta.url).pathname
const dir = join(root, "packages/ui/src/components/")
const consumers = ["apps/storybook/src/stories", "apps/showcase/src"].map((d) => join(root, d))

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
  [`ease-(?:in|out|in-out)`, "use ease-standard / -emphasized / -exit / -enter"],
  [`(?:(?:duration|delay|ease|transition|animate)-\\[|\\[(?:transition|animation)(?:-[a-z-]+)?:)[^\\]]*(?:\\d(?:ms|s)\\b|cubic-bezier)[^\\]]*\\]`, "literal timing: use a motion token or a component token"],
  [`(?:-?(?:p[lr]|m[lr]|scroll-[mp][lr]|left|right)-[^\\s"'!]+|border-[lr](?:-[^\\s"'!]+)?|rounded-(?:[lr]|[tb][lr])(?:-[^\\s"'!]+)?|text-(?:left|right)|float-(?:left|right))`, "physical direction: use ps/pe, ms/me, inset-s/-e, border-s/-e, rounded-s/-e, text-start/-end"],
  [`-?(?:start|end)-[^\\s"'!]+`, "deprecated in Tailwind 4.3: use inset-s / inset-e"],
  [`(?:bg|text|border|ring|fill|stroke|outline|from|to|via)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d+)`, "use colour system tokens"],
].map(([re, hint]) => [new RegExp(`${B}${re}${E}`, "g"), hint])

// Deliberate exceptions, each with its reason. Matched against the whole
// class, variants included.
const exceptions = [
  [/duration-1000/, "input-otp caret blink: a fixed cursor rhythm, not a theme decision"],
  [/(?:side|swipe-direction)=(?:left|right)/, "tied to a physical side prop (sheet, sidebar, drawer, tooltip)"],
  [/(?:^|:)left-1\/2$/, "centring with -translate-x-1/2, which has no logical form"],
  [/^-(?:left|right)-12$/, "carousel arrows: placed beside physical arrow icons"],
  [/rounded-tl-item-sm/, "navigation-menu indicator: a rotated square, not text-relative"],
  [/offcanvas.*left-full/, "sidebar rail: follows the physical sidebar side"],
  [/(?:^|:)bg-black\/\d+$/, "photo scrim: darkens an image the same way in every theme"],
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
        const cls = line.slice(0, m.index).match(/[^\s"'`]*$/)[0] + m[0] + line.slice(m.index + m[0].length).match(/^[^\s"'`]*/)[0]
        if (exceptions.some(([ex]) => ex.test(cls))) continue
        console.log(`${file}:${i + 1}  ${m[0]}  → ${hint}`)
        problems++
      }
    }
  })
}

const tsxFiles = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f)
    return statSync(p).isDirectory() ? tsxFiles(p) : p.endsWith(".tsx") ? [p] : []
  })

// String literals that hold classes: a className value, or any argument of
// cn/cva/clsx/cx, including strings nested in their objects and conditionals.
function classStrings(sf) {
  const out = []
  const collect = (node) => {
    if (ts.isStringLiteralLike(node)) out.push(node)
    else if (ts.isTemplateExpression(node)) out.push(node.head, ...node.templateSpans.map((s) => s.literal))
    ts.forEachChild(node, collect)
  }
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText() === "className" && node.initializer) collect(node.initializer)
    else if (ts.isPropertyAssignment(node) && node.name.getText() === "className") collect(node.initializer)
    else if (ts.isCallExpression(node) && /^(cn|cva|clsx|cx)$/.test(node.expression.getText())) node.arguments.forEach(collect)
    else ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

for (const file of consumers.flatMap(tsxFiles).sort()) {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true)
  for (const node of classStrings(sf)) {
    const text = node.text
    const line = sf.getLineAndCharacterOfPosition(node.getStart()).line + 1
    for (const [re, hint] of forbidden) {
      for (const m of text.matchAll(re)) {
        const cls = text.slice(0, m.index).match(/[^\s]*$/)[0] + m[0] + text.slice(m.index + m[0].length).match(/^[^\s]*/)[0]
        if (exceptions.some(([ex]) => ex.test(cls))) continue
        console.log(`${relative(root, file)}:${line}  ${m[0]}  → ${hint}`)
        problems++
      }
    }
  }
}

if (problems) {
  console.error(`\n${problems} forbidden class(es). See the spec's "Writing components".`)
  process.exit(1)
}
console.log("Token check passed.")
