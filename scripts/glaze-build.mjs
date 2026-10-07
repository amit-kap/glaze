// Builds the publishable Glaze package into packages/ui/dist:
// compiled JS + type definitions, the CSS (tokens, themes, globals) and a
// package.json for consumers. Usage: node scripts/glaze-build.mjs

import { execFileSync } from "node:child_process"
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"

const root = new URL("../packages/ui/", import.meta.url).pathname
const src = join(root, "src")
const dist = join(root, "dist")
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

rmSync(dist, { recursive: true, force: true })

// 1. Compile TSX → JS + .d.ts ("use client" directives are kept).
execFileSync("npx", ["tsc", "-p", join(root, "tsconfig.build.json")], { stdio: "inherit" })

// 2. Self-imports (@amit-kap/glaze/components/button) → relative paths with
//    extensions, so the output never depends on resolving its own name.
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
const self = new RegExp(`(["'])${pkg.name}/((?:components|lib|hooks)/[\\w-]+)\\1`, "g")
for (const file of walk(dist).filter((f) => /\.(js|d\.ts)$/.test(f))) {
  const code = readFileSync(file, "utf8")
  const out = code.replace(self, (_, q, target) => {
    let rel = relative(dirname(file), join(dist, target))
    if (!rel.startsWith(".")) rel = `./${rel}`
    return `${q}${rel}.js${q}`
  })
  if (out !== code) writeFileSync(file, out)
}

// 3. CSS. globals.css drops the monorepo's app sources and scans the built
//    components instead, so consumers need no @source for Glaze.
mkdirSync(join(dist, "styles"), { recursive: true })
// The source comment points at the local spec; drop it from the published copy.
writeFileSync(
  join(dist, "styles/tokens.css"),
  readFileSync(join(src, "styles/tokens.css"), "utf8").replace(/^ \* Spec: .*\n/m, "")
)
cpSync(join(src, "styles/themes"), join(dist, "styles/themes"), { recursive: true })
const globals = readFileSync(join(src, "styles/globals.css"), "utf8")
  .split("\n")
  .filter((line) => !/^@source /.test(line))
  .join("\n")
  .replace(/(@custom-variant dark[^\n]*\n)/, `$1@source "../components";\n@source "../lib";\n`)
writeFileSync(join(dist, "styles/globals.css"), globals)

// 4. package.json for consumers.
const peers = ["react", "react-dom"]
const dependencies = Object.fromEntries(Object.entries(pkg.dependencies).filter(([name]) => !peers.includes(name)))
const out = {
  name: pkg.name,
  version: pkg.version,
  description: "Glaze: shadcn/ui on Base UI, themed entirely through tokens.",
  license: "MIT",
  type: "module",
  sideEffects: ["**/*.css"],
  exports: {
    "./globals.css": "./styles/globals.css",
    "./tokens.css": "./styles/tokens.css",
    "./themes/*": "./styles/themes/*",
    "./theme": { types: "./lib/theme.d.ts", default: "./lib/theme.js" },
    "./components/*": { types: "./components/*.d.ts", default: "./components/*.js" },
    "./lib/*": { types: "./lib/*.d.ts", default: "./lib/*.js" },
    "./hooks/*": { types: "./hooks/*.d.ts", default: "./hooks/*.js" },
  },
  dependencies,
  peerDependencies: { react: "^19", "react-dom": "^19", tailwindcss: "^4" },
  keywords: ["react", "components", "shadcn", "base-ui", "tailwindcss", "design-tokens", "theming"],
  publishConfig: { access: "public" },
}
writeFileSync(join(dist, "package.json"), JSON.stringify(out, null, 2) + "\n")
// The package ships its own usage-only README (the monorepo README has dev
// notes and local paths) and the third-party licence notices.
cpSync(join(root, "PACKAGE_README.md"), join(dist, "README.md"))
cpSync(join(root, "THIRD_PARTY_NOTICES.md"), join(dist, "THIRD_PARTY_NOTICES.md"))
cpSync(join(root, "LICENSE"), join(dist, "LICENSE"))

console.log(`Built ${pkg.name}@${pkg.version} → packages/ui/dist`)
