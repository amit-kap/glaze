// Releases the built package: commits it to the `release` branch tagged
// v<version> (npm installs a git repo's root, and Glaze's root is the
// monorepo, so the built package gets a branch of its own), then optionally
// pushes it to GitHub and publishes it to npm.
// Usage: bump "version" in packages/ui/package.json, commit, then
//        node scripts/glaze-release.mjs [--push] [--npm]
// --npm runs `npm publish`, which asks for your 2FA code (in CI it uses
// npm trusted publishing instead: .github/workflows/release.yml).

import { execFileSync } from "node:child_process"
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const repo = new URL("..", import.meta.url).pathname
const git = (...args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim()
const fail = (msg) => {
  console.error(msg)
  process.exit(1)
}

const { version } = JSON.parse(readFileSync(join(repo, "packages/ui/package.json"), "utf8"))
const tag = `v${version}`

if (git("status", "--porcelain")) fail("Working tree isn't clean. Commit first, so the release matches a commit.")
if (git("tag", "--list", tag)) fail(`${tag} already exists. Bump "version" in packages/ui/package.json.`)

execFileSync("node", [join(repo, "scripts/glaze-build.mjs")], { stdio: "inherit" })
const source = git("rev-parse", "--short", "HEAD")

const dir = mkdtempSync(join(tmpdir(), "glaze-release-"))
try {
  // Build on the published release branch when there is one: a fresh clone
  // (as in CI) has no local "release", and a local one may be behind.
  let remote = true
  try {
    git("fetch", "origin", "release")
  } catch {
    remote = false
  }
  if (remote) git("worktree", "add", "-B", "release", dir, "origin/release")
  else if (git("branch", "--list", "release")) git("worktree", "add", dir, "release")
  else git("worktree", "add", "--orphan", "-b", "release", dir)

  for (const f of readdirSync(dir)) if (f !== ".git") rmSync(join(dir, f), { recursive: true, force: true })
  cpSync(join(repo, "packages/ui/dist"), dir, { recursive: true })

  const inDir = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim()
  inDir("add", "-A")
  inDir("commit", "-m", `release ${tag}`, "-m", `Built from ${source}.`)
  inDir("tag", tag)
} finally {
  git("worktree", "remove", "--force", dir)
}

console.log(`\nReleased ${tag} on branch "release" (built from ${source}).`)
// Publish before pushing: npm is the step that can be refused (2FA, publish
// rights), and the pushed tag is what marks a version as released.
if (process.argv.includes("--npm")) {
  execFileSync("npm", ["publish", join(repo, "packages/ui/dist")], { stdio: "inherit" })
  console.log(`Published. Install with: npm install @amit-kap/glaze@${version}`)
}
if (process.argv.includes("--push")) {
  git("push", "origin", "release", tag)
  console.log(`Pushed. Install with: npm install github:amit-kap/glaze#${tag}`)
} else {
  console.log(`Push with: git push origin release ${tag}`)
}
