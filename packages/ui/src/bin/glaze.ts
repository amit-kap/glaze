#!/usr/bin/env node
/// <reference types="node" />
// The glaze command.
//   glaze init [--theme <name> | --config <file>] [--mode <m>] [--density <d>]
//     Sets Glaze up in the project in the current directory: installs the
//     package, points the main CSS file at Glaze and a theme, and wraps the
//     app in ThemeProvider.
//   glaze theme <config.json> [--out <file.css>]
//     Writes the theme stylesheet for a config (see lib/config.ts), by
//     default next to the config as <name>.css.

import { spawnSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, join, relative } from "node:path"
import { createInterface } from "node:readline/promises"
import { parseArgs } from "node:util"

import {
  builtInThemes,
  parseConfig,
  type GlazeConfig,
} from "@amit-kap/glaze/lib/config"
import { generateThemeCss } from "@amit-kap/glaze/lib/generate"

const pkg = "@amit-kap/glaze"
const usage = `Usage:
  glaze init [--theme <name> | --config <file>] [--mode light|dark|system]
             [--density comfortable|compact] [--css <file>] [--entry <file>]
  glaze theme <config.json> [--out <file.css>]

Themes: ${builtInThemes.join(", ")}`

class UsageError extends Error {}

// Themes sit at ../styles/themes from both src/bin and the built bin/.
const themeFile = (name: string) =>
  readFileSync(new URL(`../styles/themes/${name}.css`, import.meta.url), "utf8")

const readConfig = (path: string) =>
  parseConfig(JSON.parse(readFileSync(path, "utf8")))

/** ThemeProvider props for the chosen theme, leaving out its own defaults. */
function providerProps(theme: string, mode?: string, density?: string) {
  const props = []
  if (theme !== "nova") props.push(`defaultTheme="${theme}"`)
  if (mode && mode !== "system") props.push(`defaultMode="${mode}"`)
  if (density && density !== "comfortable")
    props.push(`defaultDensity="${density}"`)
  return props.join(" ")
}

// ── glaze theme ──────────────────────────────────────────────────────────

function theme(args: string[]) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { out: { type: "string" } },
  })
  const [configPath] = positionals
  if (!configPath) throw new UsageError("Missing the config file.")
  const config = readConfig(configPath)
  const out = values.out ?? join(dirname(configPath), `${config.name}.css`)
  writeFileSync(out, generateThemeCss(config, themeFile(config.extends)))
  console.log(`Wrote ${out}

Use it: import it after Glaze's styles (path relative to your CSS file),
  @import "${pkg}/globals.css";
  @import "./${basename(out)}";
and apply it,
  <ThemeProvider ${providerProps(config.name, config.defaults?.mode, config.defaults?.density)}>`)
}

// ── glaze init ───────────────────────────────────────────────────────────

const cssCandidates = [
  "src/index.css",
  "src/main.css",
  "src/app.css",
  "src/App.css",
  "src/styles.css",
  "src/globals.css",
  "src/styles/globals.css",
  "src/app/globals.css",
  "app/globals.css",
  "styles/globals.css",
]
const entryCandidates = [
  "src/main.tsx",
  "src/main.jsx",
  "src/index.tsx",
  "src/index.jsx",
]
const tailwindImport = /@import\s+["']tailwindcss["'][^;]*;/

function findFiles(dir: string, ext: string, depth = 3): string[] {
  if (depth < 0 || !existsSync(dir)) return []
  return readdirSync(dir).flatMap((f) => {
    if (f === "node_modules" || f.startsWith(".")) return []
    const path = join(dir, f)
    return statSync(path).isDirectory()
      ? findFiles(path, ext, depth - 1)
      : path.endsWith(ext)
        ? [path]
        : []
  })
}

/** The project's main stylesheet: the one importing Tailwind (or Glaze). */
function findCss(): string | undefined {
  const all = [
    ...cssCandidates,
    ...["src", "app", "styles"].flatMap((d) => findFiles(d, ".css")),
  ]
  return [...new Set(all)].find(
    (f) =>
      existsSync(f) &&
      (tailwindImport.test(readFileSync(f, "utf8")) ||
        readFileSync(f, "utf8").includes(pkg))
  )
}

function packageManager() {
  if (existsSync("pnpm-lock.yaml")) return ["pnpm", "add"]
  if (existsSync("yarn.lock")) return ["yarn", "add"]
  if (existsSync("bun.lock") || existsSync("bun.lockb")) return ["bun", "add"]
  return ["npm", "install"]
}

async function askTheme(): Promise<string> {
  // Nova is the only built-in theme, so there is nothing to ask.
  if (builtInThemes.length === 1) return builtInThemes[0]
  if (!process.stdin.isTTY) return "nova"
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    console.log("Which theme?")
    builtInThemes.forEach((t, i) =>
      console.log(`  ${i + 1}. ${t}${i === 0 ? " (default)" : ""}`)
    )
    const answer = (await rl.question("Number or name: ")).trim().toLowerCase()
    const picked =
      builtInThemes[Number(answer) - 1] ??
      builtInThemes.find((t) => t === answer)
    if (!answer) return "nova"
    if (!picked) throw new UsageError(`Unknown theme "${answer}".`)
    return picked
  } finally {
    rl.close()
  }
}

/** Points the stylesheet at Glaze and the theme. Safe to run again. */
function wireCss(css: string, themeImport: string | undefined): string {
  const globals = `@import "${pkg}/globals.css";`
  // Drop earlier Glaze theme imports and the theme generated last time.
  const out = css
    .split("\n")
    .filter(
      (line) =>
        !line.includes(`${pkg}/themes/`) &&
        !/@import\s+["']\.\/[\w-]+\.css["'];\s*\/\* glaze theme \*\//.test(line)
    )
    .join("\n")
  const lines = [globals, themeImport].filter(Boolean).join("\n")
  if (out.includes(globals)) return out.replace(globals, lines)
  if (tailwindImport.test(out)) return out.replace(tailwindImport, lines)
  return `${lines}\n${out}`
}

/**
 * Wraps <App /> in ThemeProvider when the entry file is the familiar shape,
 * or, when it already has one, sets its theme, mode and density props.
 */
function wireEntry(code: string, props: string): string | undefined {
  const provider = code.match(/<ThemeProvider\b([^>]*?)(\/?)>/)
  if (provider) {
    // Keep the other props (storageKey, …); replace the three switches.
    const others = provider[1]
      .replace(
        /\s*default(?:Theme|Mode|Density)=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g,
        ""
      )
      .trim()
    const attrs = [props, others].filter(Boolean).join(" ")
    return code.replace(
      provider[0],
      `<ThemeProvider${attrs ? ` ${attrs}` : ""}${provider[2]}>`
    )
  }
  if (code.includes("ThemeProvider")) return undefined
  const app = code.match(/^([ \t]*)<App\s*\/>/m)
  if (!app || code.match(/<App\s*\/>/g)!.length !== 1) return undefined
  const indent = app[1]
  const imports = [...code.matchAll(/^import .*$/gm)]
  if (!imports.length) return undefined
  const last = imports[imports.length - 1]
  const at = last.index! + last[0].length
  // Match the file's own quotes and semicolons.
  const q = last[0].includes("'") ? "'" : '"'
  const semi = last[0].trimEnd().endsWith(";") ? ";" : ""
  const line = `import { ThemeProvider } from ${q}${pkg}/theme${q}${semi}`
  const withImport = `${code.slice(0, at)}\n${line}${code.slice(at)}`
  return withImport.replace(
    app[0],
    `${indent}<ThemeProvider${props ? ` ${props}` : ""}>\n${indent}  <App />\n${indent}</ThemeProvider>`
  )
}

async function init(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      theme: { type: "string" },
      config: { type: "string" },
      mode: { type: "string" },
      density: { type: "string" },
      css: { type: "string" },
      entry: { type: "string" },
    },
  })
  if (!existsSync("package.json"))
    throw new UsageError(
      "Run this in your project's folder (no package.json here)."
    )
  if (values.theme && values.config)
    throw new UsageError("Pass --theme or --config, not both.")
  if (
    values.theme &&
    !(builtInThemes as readonly string[]).includes(values.theme)
  )
    throw new UsageError(`Unknown theme "${values.theme}".`)
  if (values.mode && !["light", "dark", "system"].includes(values.mode))
    throw new UsageError(`--mode must be light, dark or system.`)
  if (values.density && !["comfortable", "compact"].includes(values.density))
    throw new UsageError(`--density must be comfortable or compact.`)

  const project = JSON.parse(readFileSync("package.json", "utf8"))
  const deps = { ...project.dependencies, ...project.devDependencies }
  const done: string[] = []
  const todo: string[] = []

  // Find the files first, so nothing is installed if the setup can't finish.
  const cssPath = values.css ?? findCss()
  if (values.css && !existsSync(values.css))
    throw new UsageError(`No file at ${values.css}.`)
  if (!cssPath)
    throw new UsageError(
      `Couldn't find your main CSS file (the one with @import "tailwindcss"). Pass it with --css <file>.` +
        (deps.tailwindcss
          ? ""
          : `\nGlaze needs Tailwind CSS 4: https://tailwindcss.com/docs/installation`)
    )

  const config: GlazeConfig | undefined = values.config
    ? readConfig(values.config)
    : undefined
  const themeName = config?.name ?? values.theme ?? (await askTheme())
  const mode = values.mode ?? config?.defaults?.mode
  const density = values.density ?? config?.defaults?.density

  // 1. Install.
  if (deps[pkg]) done.push(`${pkg} is already installed`)
  else {
    const [pm, add] = packageManager()
    console.log(`Installing ${pkg} with ${pm}…`)
    const result = spawnSync(pm, [add, pkg], {
      stdio: "inherit",
      shell: process.platform === "win32",
    })
    if (result.status !== 0) throw new Error(`${pm} ${add} ${pkg} failed.`)
    done.push(`Installed ${pkg}`)
  }
  if (!deps.tailwindcss)
    todo.push(`Glaze needs Tailwind CSS 4, which isn't in package.json.`)

  // 2. The theme and the stylesheet.
  let themeImport: string | undefined
  if (config) {
    const out = join(dirname(cssPath), `${config.name}.css`)
    writeFileSync(out, generateThemeCss(config, themeFile(config.extends)))
    themeImport = `@import "./${config.name}.css"; /* glaze theme */`
    done.push(`Generated ${out} from ${values.config}`)
  } else if (themeName !== "nova") {
    themeImport = `@import "${pkg}/themes/${themeName}.css";`
  }
  const css = readFileSync(cssPath, "utf8")
  const wired = wireCss(css, themeImport)
  if (wired !== css) {
    writeFileSync(cssPath, wired)
    done.push(
      `Updated ${cssPath}: Glaze's styles${themeImport ? ` and the ${themeName} theme` : ""}`
    )
  } else done.push(`${cssPath} already uses Glaze`)

  // 3. ThemeProvider.
  const props = providerProps(themeName, mode, density)
  // Wherever Glaze's ThemeProvider already is (it may not be the entry file),
  // else the entry file.
  const sources = ["src", "app"].flatMap((d) => [
    ...findFiles(d, ".tsx"),
    ...findFiles(d, ".jsx"),
  ])
  const existing = sources.find((f) => {
    const code = readFileSync(f, "utf8")
    return code.includes(`${pkg}/theme`) && /<ThemeProvider\b/.test(code)
  })
  const entryPath = values.entry ?? existing ?? entryCandidates.find(existsSync)
  const entry = entryPath ? readFileSync(entryPath, "utf8") : undefined
  const wrapped = entry !== undefined ? wireEntry(entry, props) : undefined
  if (entryPath && wrapped === entry) {
    done.push(`ThemeProvider in ${entryPath} is already set`)
  } else if (entryPath && wrapped) {
    writeFileSync(entryPath, wrapped)
    done.push(
      existing === entryPath || /<ThemeProvider\b/.test(entry!)
        ? `Updated ThemeProvider in ${entryPath}${props ? `: ${props}` : ""}`
        : `Wrapped <App /> in ThemeProvider in ${entryPath}`
    )
  } else {
    todo.push(`Wrap your app in ThemeProvider (couldn't do it safely${entryPath ? ` in ${entryPath}` : ""}):
     import { ThemeProvider } from "${pkg}/theme"
     <ThemeProvider${props ? ` ${props}` : ""}>{children}</ThemeProvider>`)
  }

  console.log(
    `\nGlaze is set up${themeName === "nova" ? "" : ` with ${themeName}`}.`
  )
  for (const line of done) console.log(`  ✓ ${line}`)
  for (const line of todo) console.log(`  ! ${line}`)
  console.log(
    `\nUse components like: import { Button } from "${pkg}/components/button"`
  )
  if (relative(".", cssPath).startsWith(".."))
    console.log(`(Edited a file outside this folder: ${cssPath})`)
}

// ── main ─────────────────────────────────────────────────────────────────

const [command, ...args] = process.argv.slice(2)
try {
  if (command === "init") await init(args)
  else if (command === "theme") theme(args)
  else throw new UsageError(command ? `Unknown command "${command}".` : "")
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  // parseArgs reports unknown or malformed flags with ERR_PARSE_ARGS_* codes.
  const misused =
    error instanceof UsageError ||
    String((error as { code?: string }).code).startsWith("ERR_PARSE_ARGS")
  console.error(
    misused ? [message, usage].filter(Boolean).join("\n\n") : message
  )
  process.exit(1)
}
