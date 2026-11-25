import { expect, test } from "@playwright/test"

import { ports } from "../playwright.config"
import { trackErrors } from "./helpers"

const home = `http://localhost:${ports.web}/`

test.describe("Glaze home page", () => {
  test("describes Glaze and shows the install command", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(home)
    await expect(page).toHaveTitle(/Glaze/)
    await expect(page.getByTestId("home-hero")).toBeVisible()
    await expect(
      page.getByTestId("home-hero").getByRole("heading", { level: 1 })
    ).toBeVisible()
    await expect(page.getByTestId("install-command")).toContainText(
      "npx @amit-kap/glaze init"
    )
    tracked.expectNone()
  })

  test("links to the showcase and to Studio", async ({ page }) => {
    await page.goto(home)
    await expect(page.getByTestId("link-studio")).toHaveAttribute(
      "href",
      new RegExp(`localhost:${ports.studio}`)
    )
    await expect(page.getByTestId("link-showcase")).toHaveAttribute(
      "href",
      new RegExp(`localhost:${ports.showcase}`)
    )
  })

  test("the showcase link opens the showcase", async ({ page }) => {
    await page.goto(home)
    await page.getByTestId("link-showcase").click()
    await expect(page.getByTestId("overview-grid")).toBeVisible()
  })

  test("the Studio link opens Studio", async ({ page }) => {
    await page.goto(home)
    await page.getByTestId("link-studio").click()
    await expect(page.getByTestId("studio-home")).toBeVisible()
  })

  test("fits a phone without sideways scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(home)
    await expect(page.getByTestId("home-hero")).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
