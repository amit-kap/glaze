// Prints Paper markup for icon cells on the "icons · lucide" page, built from the installed lucide-react.
// Usage: node scripts/paper-icon-cells.mjs layers database cloud
// Paste the output into write_html (insert-children) on the icons Grid, in the master and in any sketch copy.

import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const names = process.argv.slice(2)
if (names.length === 0) {
  console.error("Usage: node scripts/paper-icon-cells.mjs <icon-name> [...]")
  process.exit(1)
}

const iconsDir = new URL("../node_modules/lucide-react/dist/esm/icons/", import.meta.url)
const stroke = 'fill="none" stroke="var(--color-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

for (const name of names) {
  const file = new URL(`${name}.mjs`, iconsDir)
  if (!existsSync(fileURLToPath(file))) {
    console.error(`Unknown lucide icon: ${name}`)
    process.exit(1)
  }
  // Renamed icons are alias files that re-export another icon; follow them to the real module.
  let source = file
  const alias = readFileSync(fileURLToPath(file), "utf8").match(/export \{ default \} from '\.\/(.+)\.mjs'/)
  if (alias) source = new URL(`${alias[1]}.mjs`, iconsDir)
  const { __iconData } = await import(source)
  const shapes = __iconData.node
    .map(([tag, attrs]) => {
      const list = Object.entries(attrs)
        .filter(([key]) => key !== "key")
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
      return `<${tag} ${list} ${stroke}/>`
    })
    .join("")

  console.log(
    `<div layer-name="Cell" style="display:flex;flex-direction:column;align-items:center;gap:8px;width:96px;flex-shrink:0">` +
      `<div style="width:40px;height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--color-muted);border-radius:var(--radius-md)">` +
      `<svg layer-name="Icon / ${name}" width="16" height="16" viewBox="0 0 24 24" style="display:inline-block;flex-shrink:0">${shapes}</svg>` +
      `</div>` +
      `<div style="font-family:'Geist Mono';font-size:11px;line-height:14px;color:var(--color-muted-foreground)">${name}</div>` +
      `</div>`
  )
}
