// Builds the whole Glaze site into _site/, the one folder that is deployed:
//   /            the home page (apps/web)
//   /showcase/   the showcase
//   /studio/     Glaze Studio, built against the published package
//   /storybook/  Storybook
// Every app is built with relative asset paths, so the folder works at any
// address. Usage: node scripts/site-build.mjs

import { execFileSync } from "node:child_process"
import { cpSync, mkdirSync, rmSync } from "node:fs"

const root = new URL("../", import.meta.url).pathname
const run = (args, env = {}) =>
  execFileSync("npm", args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  })

run(["run", "build", "-w", "web", "--", "--base=./"])
run(["run", "build", "-w", "showcase", "--", "--base=./"])
run(["run", "build:deploy", "-w", "studio", "--", "--base=./"])
run(["run", "build", "-w", "storybook"])

const site = `${root}_site`
rmSync(site, { recursive: true, force: true })
mkdirSync(site)
cpSync(`${root}apps/web/dist`, site, { recursive: true })
for (const app of ["showcase", "studio", "storybook"])
  cpSync(`${root}apps/${app}/dist`, `${site}/${app}`, { recursive: true })

console.log("Built _site: /, /showcase/, /studio/, /storybook/")
