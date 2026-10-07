// Releases the built package to the `release` branch, tagged v<version>, so
// projects can install it from git: npm install github:amit-kap/glaze#v0.1.0
// (npm installs a git repo's root, and Glaze's root is the monorepo, so the
// built package gets a branch of its own.)
// Usage: bump "version" in packages/ui/package.json, commit, then
//        node scripts/glaze-release.mjs [--push]

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
  const hasBranch = git("branch", "--list", "release") !== ""
  if (hasBranch) git("worktree", "add", dir, "release")
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
if (process.argv.includes("--push")) {
  git("push", "origin", "release", tag)
  console.log(`Pushed. Install with: npm install github:amit-kap/glaze#${tag}`)
} else {
  console.log(`Push with: git push origin release ${tag}`)
}
