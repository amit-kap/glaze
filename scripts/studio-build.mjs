// Builds Glaze Studio against the published @amit-kap/glaze package, the way
// the deployed site is built: it downloads the newest release (or the version
// in GLAZE_VERSION), unpacks it, and points the build at it instead of at
// packages/ui. The deployed site then shows what people get from npm, and
// says which version it is.
// Usage: node scripts/studio-build.mjs
//   GLAZE_VERSION=0.4.0 node scripts/studio-build.mjs   pin a version

import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"

const studio = new URL("../apps/studio/", import.meta.url).pathname
const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", ...options }).trim()

const name = "@amit-kap/glaze"
// Never fall back to the monorepo source: a deploy that quietly shows
// unreleased code is worse than one that fails.
let version = process.env.GLAZE_VERSION
if (!version) {
  version = run("npm", ["view", name, "version"])
  if (!version) {
    console.error(`Could not read the latest ${name} version from npm.`)
    process.exit(1)
  }
}

const dir = join(studio, ".glaze-published")
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
const tarball = run("npm", ["pack", `${name}@${version}`, "--silent"], {
  cwd: dir,
})
run("tar", ["xzf", tarball], { cwd: dir })

const published = JSON.parse(readFileSync(join(dir, "package/package.json"), "utf8"))
console.log(`Building Studio against ${name}@${published.version}`)

execFileSync("npx", ["vite", "build"], {
  cwd: studio,
  stdio: "inherit",
  env: {
    ...process.env,
    GLAZE_PACKAGE_DIR: join(dir, "package"),
    GLAZE_VERSION: published.version,
  },
})
