import { expect, test, type Page } from "@playwright/test"

import { ports } from "../playwright.config"
import { trackErrors } from "./helpers"

const studio = `http://localhost:${ports.studio}/`
const draftKey = "glaze-studio-draft-v1"

const draft = (page: Page) =>
  page.evaluate((key) => localStorage.getItem(key), draftKey)

/** Opening a theme over unsaved work asks first; these tests discard. */
async function discardIfAsked(page: Page) {
  const discard = page.getByRole("button", { name: "Discard" })
  await Promise.race([
    page.getByTestId("studio-editor").waitFor(),
    discard.waitFor(),
  ])
  if (await discard.isVisible()) await discard.click()
  await expect(page.getByTestId("studio-editor")).toBeVisible()
}

async function signIn(page: Page) {
  await page.getByTestId("sign-in").first().click()
  const dialog = page.getByRole("dialog")
  await dialog.locator('input[name="name"]').fill("Test User")
  await dialog.locator('input[name="email"]').fill("test@example.com")
  await dialog.getByRole("button", { name: /continue|sign in/i }).click()
  await expect(page.getByTestId("user-menu")).toBeVisible()
}

test.describe("Studio home", () => {
  test("opens on Home with three templates, signed out", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(studio)
    await expect(page.getByTestId("studio-home")).toBeVisible()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
    await expect(page.getByTestId("theme-card")).toHaveCount(0)
    await expect(page.getByTestId("sign-in").first()).toBeVisible()
    await expect(page.getByTestId("studio-editor")).toHaveCount(0)
    tracked.expectNone()
  })

  test("each template card previews its own theme", async ({ page }) => {
    await page.goto(studio)
    const cards = page.getByTestId("template-card")
    await expect(cards).toHaveCount(3)
    // Font and colours come from the theme, so the three previews differ.
    const looks = await cards.evaluateAll((nodes) =>
      nodes.map((node) => {
        const pane = node.parentElement!.querySelector("[data-theme]")!
        const style = getComputedStyle(pane)
        const button = pane.querySelector("[data-slot=button]")!
        const heading = pane.querySelector(".font-heading")!
        return [
          style.backgroundColor,
          style.fontFamily,
          getComputedStyle(button).backgroundColor,
          getComputedStyle(button).height,
          getComputedStyle(heading).fontFamily,
        ].join("|")
      })
    )
    expect(new Set(looks).size).toBe(3)
    const names = await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-template"))
    )
    expect(new Set(names).size).toBe(3)
  })

  test("clicking a template opens the editor with it applied", async ({
    page,
  }) => {
    await page.goto(studio)
    const cards = page.getByTestId("template-card")
    const drafts: (string | null)[] = []
    for (let index = 0; index < 3; index++) {
      const name = await cards.nth(index).getAttribute("data-template")
      await cards.nth(index).click()
      await discardIfAsked(page)
      await expect(page).toHaveURL(/#\/edit/)
      await expect(page.getByLabel("Theme name")).toHaveValue(name!)
      drafts.push(await draft(page))
      await page.getByTestId("home-link").click()
      await expect(page.getByTestId("studio-home")).toBeVisible()
    }
    // Three templates, three different themes in the editor.
    expect(new Set(drafts).size).toBe(3)
  })

  test("signing in shows the user's own themes", async ({ page }) => {
    await page.goto(studio)
    // Make a theme: open a template, name it, save.
    await page.getByTestId("template-card").nth(1).click()
    await discardIfAsked(page)
    await page.getByLabel("Theme name").fill("My brand")
    await page.getByRole("button", { name: /^Save/ }).click()
    await expect(page.getByRole("button", { name: /^Saved/ })).toBeVisible()
    const saved = await draft(page)

    await page.getByTestId("home-link").click()
    await expect(page.getByTestId("studio-home")).toBeVisible()
    await expect(page.getByTestId("theme-card")).toHaveCount(0)

    await signIn(page)
    await expect(page.getByTestId("new-theme-card")).toBeVisible()
    const mine = page.getByTestId("theme-card")
    await expect(mine).toHaveCount(1)
    await expect(mine).toHaveAccessibleName("My brand")

    // The sign-in survives a reload.
    await page.reload()
    await expect(page.getByTestId("user-menu")).toBeVisible()
    await expect(page.getByTestId("theme-card")).toHaveCount(1)

    // Open another template, then come back to the saved theme.
    await page.getByTestId("template-card").nth(2).click()
    await discardIfAsked(page)
    expect(await draft(page)).not.toBe(saved)
    await page.getByTestId("home-link").click()
    await page.getByTestId("theme-card").click()
    await discardIfAsked(page)
    await expect(page.getByLabel("Theme name")).toHaveValue("My brand")
    expect(await draft(page)).toBe(saved)
  })

  test("signing out hides the user's themes again", async ({ page }) => {
    await page.goto(studio)
    await signIn(page)
    await page.getByTestId("user-menu").click()
    await page.getByText(/sign out/i).click()
    await expect(page.getByTestId("sign-in").first()).toBeVisible()
    await expect(page.getByTestId("new-theme-card")).toHaveCount(0)
    await expect(page.getByTestId("template-card")).toHaveCount(3)
  })

  test("back returns from the editor to Home", async ({ page }) => {
    await page.goto(studio)
    await page.getByTestId("template-card").first().click()
    await discardIfAsked(page)
    await page.goBack()
    await expect(page.getByTestId("studio-home")).toBeVisible()
  })
})
