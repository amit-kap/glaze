import { expect, test } from "@playwright/test"

import { ports } from "../playwright.config"
import { trackErrors } from "./helpers"

// The assembled site (npm run build:site): one address, the apps as routes.
const site = `http://localhost:${ports.site}`

test.describe("One site", () => {
  test("/ is the home page", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(`${site}/`)
    await expect(page.getByTestId("home-hero")).toBeVisible()
    tracked.expectNone()
  })

  test("/showcase/ is the showcase", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(`${site}/showcase/`)
    await expect(page.getByTestId("overview-grid")).toBeVisible()
    await page.goto(`${site}/showcase/#/button`)
    await expect(page.getByTestId("variant-card").first()).toBeVisible()
    tracked.expectNone()
  })

  test("/studio/ is Studio", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(`${site}/studio/`)
    await expect(page.getByTestId("studio-home")).toBeVisible()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
    await page.getByTestId("template-card").nth(1).click()
    await expect(page).toHaveURL(`${site}/studio/#/edit`)
    await expect(page.getByTestId("studio-editor")).toBeVisible()
    tracked.expectNone()
  })

  test("/storybook/ is Storybook", async ({ page }) => {
    const response = await page.goto(`${site}/storybook/`)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Storybook/)
  })

  test("the home page links stay on the site", async ({ page }) => {
    await page.goto(`${site}/`)
    await page.getByTestId("link-showcase").click()
    await expect(page).toHaveURL(`${site}/showcase/`)
    await expect(page.getByTestId("overview-grid")).toBeVisible()
    // The showcase's wordmark goes home, its footer link to Studio.
    await page.getByRole("link", { name: "Glaze", exact: true }).click()
    await expect(page).toHaveURL(`${site}/`)
    await page.getByTestId("link-studio").click()
    await expect(page).toHaveURL(`${site}/studio/`)
    await expect(page.getByTestId("studio-home")).toBeVisible()
  })

  test("Studio's icons load from its own folder", async ({ page, request }) => {
    await page.goto(`${site}/studio/`)
    const href = await page
      .locator('link[rel="icon"]')
      .evaluate((link: HTMLLinkElement) => link.href)
    expect(href).toContain("/studio/")
    expect((await request.get(href)).status()).toBe(200)
  })
})
