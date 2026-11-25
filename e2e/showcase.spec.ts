import { readdirSync } from "node:fs"
import { resolve } from "node:path"
import { expect, test } from "@playwright/test"

import { ports } from "../playwright.config"
import { trackErrors } from "./helpers"

const showcase = `http://localhost:${ports.showcase}/`

// Every component has one story file; the side panel must list them all.
const components = readdirSync(
  resolve(process.cwd(), "apps/storybook/src/stories")
)
  .filter((file) => file.endsWith(".stories.tsx"))
  .map((file) => file.replace(".stories.tsx", ""))
  .sort()

test.describe("Showcase", () => {
  test("opens on the overview grid", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(showcase)
    await expect(page.getByTestId("overview-grid")).toBeVisible()
    await expect(
      page.getByTestId("overview-grid").getByRole("region").first()
    ).toBeVisible()
    tracked.expectNone()
  })

  test("the side panel lists every component", async ({ page }) => {
    await page.goto(showcase)
    const items = page
      .getByTestId("component-nav")
      .locator('[data-testid="nav-item"][data-component]')
    await expect(items).toHaveCount(components.length)
    const listed = await items.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-component")).sort()
    )
    expect(listed).toEqual(components)
  })

  test("clicking a component shows each variant in its own card", async ({
    page,
  }) => {
    await page.goto(showcase)
    await page
      .locator('[data-testid="nav-item"][data-component="button"]')
      .click()
    await expect(page).toHaveURL(/#\/button$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Button")
    const cards = page.getByTestId("variant-grid").getByTestId("variant-card")
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(3)
    const names = await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-story"))
    )
    expect(new Set(names).size).toBe(names.length)
    // The cards hold the real component.
    await expect(cards.first().getByRole("button").first()).toBeVisible()
    await expect(
      page.locator('[data-testid="nav-item"][data-component="button"]')
    ).toHaveAttribute("aria-current", "page")
  })

  test("deep links and back/forward work", async ({ page }) => {
    await page.goto(`${showcase}#/alert-dialog`)
    await expect(page.getByTestId("variant-card").first()).toBeVisible()
    // Nothing opens by itself and covers the page.
    await expect(page.getByRole("alertdialog")).toHaveCount(0)
    await page
      .locator('[data-testid="nav-item"][data-component="badge"]')
      .click()
    await expect(page).toHaveURL(/#\/badge$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Badge")
    await page.goBack()
    await expect(page).toHaveURL(/#\/alert-dialog$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Alert Dialog"
    )
  })

  test("a variant's trigger still opens its dialog", async ({ page }) => {
    await page.goto(`${showcase}#/alert-dialog`)
    await page
      .getByTestId("variant-card")
      .first()
      .getByRole("button")
      .first()
      .click()
    await expect(page.getByRole("alertdialog")).toBeVisible()
  })

  test("the filter narrows the list", async ({ page }) => {
    await page.goto(showcase)
    await page.getByLabel("Filter components").fill("butt")
    const items = page.locator('[data-testid="nav-item"][data-component]')
    await expect(items).toHaveCount(3)
    expect(
      await items.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-component"))
      )
    ).toEqual(["button", "button-group", "reveal-button"])
  })

  // The whole library: every component renders its variants without an error.
  for (const component of components) {
    test(`renders ${component}`, async ({ page }) => {
      const pageErrors: string[] = []
      page.on("pageerror", (error) => pageErrors.push(error.message))
      await page.goto(`${showcase}#/${component}`)
      await expect(page.getByTestId("variant-card").first()).toBeVisible()
      await expect(page.getByTestId("variant-error")).toHaveCount(0)
      expect(pageErrors, pageErrors.join("\n")).toEqual([])
    })
  }
})
