#!/usr/bin/env node
/**
 * Checks the settings catalog against the CSS and the components.
 *
 *   node scripts/glaze-catalog.mjs          verify (CI)
 *   node scripts/glaze-catalog.mjs --write  regenerate consumers.ts
 *
 * Four rules:
 *   1. Every catalog token exists in the CSS (declared, or used with a fallback).
 *   2. Every value Nova sets is in the catalog, so the editor can reach it.
 *   3. The generated CSS baseline matches the package version.
 *   4. consumers.ts matches what the components actually use.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import prettier from "prettier"

const root = fileURLToPath(new URL("..", import.meta.url))
const ui = join(root, "packages/ui/src")
const styles = join(ui, "styles")
const write = process.argv.includes("--write")

const fail = []
const warn = []

function read(path) {
  return readFileSync(path, "utf8")
}

const cssFiles = [
  join(styles, "tokens.css"),
  join(styles, "globals.css"),
  ...readdirSync(join(styles, "themes"))
    .filter((name) => name.endsWith(".css"))
    .map((name) => join(styles, "themes", name)),
]
const css = cssFiles.map(read).join("\n")

// 1. Catalog tokens ↔ CSS
const catalogSource = read(join(ui, "theme/catalog.ts"))
const catalogTokens = new Set(
  [...catalogSource.matchAll(/token: "(--[\w-]+)"/g)].map((m) => m[1])
)
const declared = new Set([
  ...[...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]),
  ...[...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]),
])

for (const token of catalogTokens)
  if (!declared.has(token)) fail.push(`catalog: ${token} is not in the CSS`)

// 2. Nova is the baseline: everything it sets must be editable.
const nova = read(join(styles, "themes/nova.css"))
const novaInputs = new Set(
  [...nova.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])
)
for (const token of novaInputs)
  if (!catalogTokens.has(token))
    fail.push(`nova: ${token} is set by Nova but missing from the catalog`)

// Values declared in other themes are allowed to be theme-only overrides.
const otherThemes = readdirSync(join(styles, "themes"))
  .filter((name) => name.endsWith(".css") && name !== "nova.css")
  .map((name) => ({ name, css: read(join(styles, "themes", name)) }))
for (const theme of otherThemes) {
  for (const [, token] of theme.css.matchAll(/(--[\w-]+)\s*:/g))
    if (!catalogTokens.has(token) && !declared.has(token))
      warn.push(`${theme.name}: ${token} is not in the catalog`)
}

// 3. Generated CSS records the library version it targets.
const pkg = JSON.parse(read(join(root, "packages/ui/package.json")))
const baseline = read(join(ui, "lib/config.ts")).match(
  /export const glazeBaseline = "([^"]+)"/
)?.[1]
if (!baseline) fail.push("config.ts: glazeBaseline is missing")
else if (baseline !== pkg.version)
  fail.push(
    `config.ts: glazeBaseline ${baseline} does not match package version ${pkg.version}`
  )

// 4. Consumers: which component uses which setting.
const globalsCss = read(join(styles, "globals.css"))
const utilityOf = new Map() // token -> utility names

function addUtility(token, names) {
  if (!utilityOf.has(token)) utilityOf.set(token, new Set())
  for (const name of names) utilityOf.get(token).add(name)
}

for (const [, name, token] of globalsCss.matchAll(
  /--color-([\w-]+):\s*var\((--[\w-]+)\)/g
))
  addUtility(token, [
    `bg-${name}`,
    `text-${name}`,
    `border-${name}`,
    `ring-${name}`,
    `fill-${name}`,
    `stroke-${name}`,
    `outline-${name}`,
    `divide-${name}`,
    `from-${name}`,
    `via-${name}`,
    `to-${name}`,
    `placeholder-${name}`,
    `caret-${name}`,
  ])
for (const [, name, token] of globalsCss.matchAll(
  /--radius-([\w-]+):\s*(?:var|calc)\((--[\w-]+)/g
))
  addUtility(token, [`rounded-${name}`])
for (const [, name, token] of globalsCss.matchAll(
  /--shadow-([\w-]+):\s*var\((--[\w-]+)\)/g
))
  addUtility(token, [`shadow-${name}`])
for (const [, name, token] of globalsCss.matchAll(
  /--text-([\w-]+):\s*var\((--[\w-]+)\)/g
))
  addUtility(token, [`text-${name}`])
for (const [, name, token] of globalsCss.matchAll(
  /--font-([\w-]+):\s*var\((--[\w-]+)\)/g
))
  addUtility(token, [`font-${name}`])
for (const [, name, token] of globalsCss.matchAll(
  /--ease-([\w-]+):\s*var\((--[\w-]+)\)/g
))
  addUtility(token, [`ease-${name}`])

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory()
      ? walk(path)
      : path.endsWith(".tsx") || path.endsWith(".ts")
        ? [path]
        : []
  })
}

const componentsDir = join(ui, "components")
const consumers = new Map()
for (const file of walk(componentsDir)) {
  const source = read(file)
  const name = relative(componentsDir, file).replace(/\.tsx?$/, "")
  for (const [token, utilities] of utilityOf) {
    const used = [...utilities].some((utility) =>
      new RegExp(`${utility}(?![\\w-])`).test(source)
    )
    if (used || source.includes(`var(${token})`))
      consumers.set(token, [...(consumers.get(token) ?? []), name])
  }
}
for (const [token, names] of consumers)
  consumers.set(token, [...new Set(names)].sort())

const source = [
  "/**",
  " * Which component reads which setting.",
  " *",
  " * Generated by `npm run check:catalog --write` from the component sources and",
  " * the Tailwind bridge in globals.css. Do not edit by hand; rerun the script",
  " * after changing a component.",
  " */",
  "export const settingConsumers: Record<string, string[]> = {",
  ...[...consumers]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([token, names]) =>
        `  ${JSON.stringify(token)}: [${names.map((n) => JSON.stringify(n)).join(", ")}],`
    ),
  "}",
  "",
].join("\n")

const consumersPath = join(ui, "theme/consumers.ts")
// Format it here so the generated file always matches `npm run format`.
const prettierOptions = (await prettier.resolveConfig(consumersPath)) ?? {}
const body = await prettier.format(source, {
  ...prettierOptions,
  filepath: consumersPath,
})
if (write) {
  writeFileSync(consumersPath, body)
  console.log(
    `check:catalog: wrote ${consumers.size} consumer entries for ${catalogTokens.size} settings`
  )
} else {
  let current = ""
  try {
    current = read(consumersPath)
  } catch {
    fail.push("consumers.ts is missing; run `npm run check:catalog -- --write`")
  }
  if (current && current !== body)
    fail.push("consumers.ts is stale; run `npm run check:catalog -- --write`")
}

for (const message of warn) console.warn(`warn: ${message}`)
if (fail.length) {
  for (const message of fail) console.error(`error: ${message}`)
  process.exit(1)
}
console.log(
  `check:catalog: ${catalogTokens.size} settings, ${novaInputs.size} set by Nova, ${consumers.size} with consumers, baseline ${baseline}`
)
