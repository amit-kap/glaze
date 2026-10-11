#!/usr/bin/env node
/// <reference types="node" />
// The glaze command. Usage: glaze theme <config.json> [--out <file.css>]
// Writes the theme stylesheet for a config (see lib/config.ts), by default
// next to the config as <name>.css.

import { readFileSync, writeFileSync } from "node:fs"
import { basename, dirname, join } from "node:path"

import { parseConfig } from "@amit-kap/glaze/lib/config"
import { generateThemeCss } from "@amit-kap/glaze/lib/generate"

const usage = "Usage: glaze theme <config.json> [--out <file.css>]"
const [command, configPath, ...rest] = process.argv.slice(2)

if (command !== "theme" || !configPath) {
  console.error(usage)
  process.exit(1)
}

try {
  const config = parseConfig(JSON.parse(readFileSync(configPath, "utf8")))
  // Themes sit at ../styles/themes from both src/bin and the built bin/.
  const baseCss = readFileSync(
    new URL(`../styles/themes/${config.extends}.css`, import.meta.url),
    "utf8"
  )
  const outIndex = rest.indexOf("--out")
  const out =
    outIndex === -1
      ? join(dirname(configPath), `${config.name}.css`)
      : rest[outIndex + 1]
  if (!out) throw new Error(usage)

  writeFileSync(out, generateThemeCss(config, baseCss))

  const provider = [`defaultTheme="${config.name}"`]
  if (config.defaults?.mode)
    provider.push(`defaultMode="${config.defaults.mode}"`)
  if (config.defaults?.density)
    provider.push(`defaultDensity="${config.defaults.density}"`)
  console.log(`Wrote ${out}

Use it: import it after Glaze's styles (path relative to your CSS file),
  @import "@amit-kap/glaze/globals.css";
  @import "./${basename(out)}";
and apply it,
  <ThemeProvider ${provider.join(" ")}>`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
