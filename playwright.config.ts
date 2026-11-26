import { defineConfig, devices } from "@playwright/test"

// Acceptance tests for the three sites: the home page (apps/web), the
// showcase and Glaze Studio. Each runs on its own dev server.
export const ports = { web: 4301, showcase: 4302, studio: 4303, site: 4304 }
const url = (port: number) => `http://localhost:${port}`

const server = (workspace: string, port: number, env = {}) => ({
  command: `npm run dev -w ${workspace} -- --port ${port} --strictPort`,
  url: url(port),
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
  env: { PORT: String(port), ...env },
})

// SITE=1 tests the assembled site in _site/ (npm run test:site) instead of
// the three dev servers.
const site = !!process.env.SITE

export default defineConfig({
  testDir: "e2e",
  testMatch: site ? "site.spec.ts" : undefined,
  testIgnore: site ? undefined : "site.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  // Locally the tests drive the installed Chrome; CI downloads Chromium
  // (npx playwright install chromium).
  use: {
    ...devices["Desktop Chrome"],
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  webServer: site
    ? {
        command: `npx vite preview --outDir _site --port ${ports.site} --strictPort`,
        url: url(ports.site),
        reuseExistingServer: false,
      }
    : [
        server("web", ports.web, {
          VITE_SHOWCASE_URL: `${url(ports.showcase)}/`,
          VITE_STUDIO_URL: `${url(ports.studio)}/`,
        }),
        server("showcase", ports.showcase, {
          VITE_HOME_URL: `${url(ports.web)}/`,
          VITE_STUDIO_URL: `${url(ports.studio)}/`,
        }),
        server("studio", ports.studio),
      ],
})
