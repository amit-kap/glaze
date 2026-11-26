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

/** From Home, make and save a theme with this name, then come back to Home. */
async function makeTheme(page: Page, name: string) {
  await page.getByTestId("new-theme").click()
  await discardIfAsked(page)
  await page.getByLabel("Theme name").fill(name)
  await page.getByRole("button", { name: /^Save/ }).click()
  await expect(page.getByRole("button", { name: /^Saved/ })).toBeVisible()
  await page.getByTestId("home-link").click()
  await expect(page.getByTestId("studio-home")).toBeVisible()
}

/** Open the first card's actions menu and choose an item. */
async function chooseAction(page: Page, item: string) {
  await page.getByTestId("theme-actions").first().click()
  await page.getByRole("menuitem", { name: item }).click()
}

const badge = (page: Page) => page.locator("[data-slot=sidebar-menu-badge]")

test.describe("Studio home", () => {
  test("opens on Home with three templates, signed out", async ({ page }) => {
    const tracked = trackErrors(page)
    await page.goto(studio)
    await expect(page.getByTestId("studio-home")).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Recents")
    await expect(page.getByTestId("template-card")).toHaveCount(3)
    await expect(page.getByTestId("theme-card")).toHaveCount(0)
    await expect(page.getByTestId("sign-in").first()).toBeVisible()
    await expect(page.getByTestId("new-theme")).toBeVisible()
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
    // The poster says what signing in gives: the theme saved a moment ago.
    await expect(page.getByTestId("sign-in-poster")).toContainText(
      "You have 1 saved theme waiting."
    )

    await signIn(page)
    await expect(page.getByTestId("new-theme")).toBeVisible()
    const mine = page.getByTestId("theme-card")
    await expect(mine).toHaveCount(1)
    await expect(mine).toHaveAccessibleName("My brand")

    // The sign-in survives a reload.
    await page.reload()
    await expect(page.getByTestId("user-menu")).toBeVisible()
    await expect(page.getByTestId("theme-card")).toHaveCount(1)

    // Open another template, then come back to the saved theme.
    await page.getByTestId("nav-templates").click()
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
    await expect(page.getByTestId("theme-card")).toHaveCount(0)
    await expect(page.getByTestId("template-card")).toHaveCount(3)
  })

  test("back returns from the editor to Home", async ({ page }) => {
    await page.goto(studio)
    await page.getByTestId("template-card").first().click()
    await discardIfAsked(page)
    await page.goBack()
    await expect(page.getByTestId("studio-home")).toBeVisible()
  })

  test("the side panel moves between the three pages", async ({ page }) => {
    await page.goto(studio)
    const heading = page.getByRole("heading", { level: 1 })
    await page.getByTestId("nav-templates").click()
    await expect(page).toHaveURL(/#\/templates$/)
    await expect(heading).toHaveText("Templates")
    await expect(page.getByTestId("template-card")).toHaveCount(3)
    await page.getByTestId("nav-archive").click()
    await expect(page).toHaveURL(/#\/archive$/)
    await expect(heading).toHaveText("Archive")
    await page.getByTestId("nav-recents").click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(heading).toHaveText("Recents")
    // The current page's link is marked active (the attribute is present).
    await expect(page.getByTestId("nav-recents")).toHaveAttribute("data-active")
    await expect(page.getByTestId("nav-archive")).not.toHaveAttribute(
      "data-active"
    )
  })

  test("New theme opens the editor on a fresh theme", async ({ page }) => {
    await page.goto(studio)
    await page.getByTestId("new-theme").click()
    await discardIfAsked(page)
    await expect(page).toHaveURL(/#\/edit/)
    await expect(page.getByLabel("Theme name")).toHaveValue("Untitled theme")
  })

  test("archiving moves a theme to Archive, and Undo brings it back", async ({
    page,
  }) => {
    await page.goto(studio)
    await signIn(page)
    await makeTheme(page, "Alpha")
    await expect(page.getByTestId("theme-card")).toHaveCount(1)
    await expect(badge(page)).toHaveCount(0)

    await chooseAction(page, "Archive")
    await expect(page.getByTestId("theme-card")).toHaveCount(0)
    await expect(page.getByText("Archived Alpha")).toBeVisible()
    await expect(badge(page)).toHaveText("1")

    await page.getByRole("button", { name: "Undo" }).click()
    await expect(page.getByTestId("theme-card")).toHaveCount(1)
    await expect(badge(page)).toHaveCount(0)
  })

  test("Archive restores a theme", async ({ page }) => {
    await page.goto(studio)
    await signIn(page)
    await makeTheme(page, "Alpha")
    await chooseAction(page, "Archive")
    await page.getByTestId("nav-archive").click()
    await expect(page.getByTestId("archived-card")).toHaveCount(1)
    // An archived theme has no opener.
    await expect(page.getByTestId("theme-card")).toHaveCount(0)

    await page.getByRole("button", { name: "Restore" }).click()
    await expect(page.getByText("Restored Alpha")).toBeVisible()
    await expect(page.getByTestId("archived-card")).toHaveCount(0)
    await expect(page.getByText("Nothing archived")).toBeVisible()
    await page.getByTestId("nav-recents").click()
    await expect(page.getByTestId("theme-card")).toHaveCount(1)
  })

  test("Delete forever asks first, then removes the theme", async ({
    page,
  }) => {
    await page.goto(studio)
    await signIn(page)
    await makeTheme(page, "Alpha")
    await chooseAction(page, "Archive")
    await page.getByTestId("nav-archive").click()

    await chooseAction(page, "Delete forever")
    const dialog = page.getByRole("alertdialog")
    await expect(dialog).toContainText("Delete Alpha forever?")
    await expect(dialog).toContainText("This can't be undone.")
    await dialog.getByRole("button", { name: "Cancel" }).click()
    await expect(page.getByTestId("archived-card")).toHaveCount(1)

    await chooseAction(page, "Delete forever")
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete", exact: true })
      .click()
    await expect(page.getByTestId("archived-card")).toHaveCount(0)
    await expect(page.getByText("Nothing archived")).toBeVisible()
    const stored = await page.evaluate(() =>
      localStorage.getItem("glaze-studio-library-v1")
    )
    expect(stored).not.toContain("Alpha")
  })

  test("the grid and list toggle switches the view and is remembered", async ({
    page,
  }) => {
    await page.goto(studio + "#/templates")
    await expect(page.getByRole("table")).toHaveCount(0)
    await expect(page.getByRole("tab", { name: "Grid view" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    await page.getByTestId("view-list").click()
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
    await expect(
      page.getByTestId("template-card").first()
    ).toHaveAccessibleName(/\S/)

    await page.reload()
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByRole("tab", { name: "List view" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    // A list row opens the template.
    await page.getByTestId("template-card").nth(1).click()
    await discardIfAsked(page)
    await expect(page).toHaveURL(/#\/edit/)

    await page.goBack()
    await page.getByTestId("view-grid").click()
    await expect(page.getByRole("table")).toHaveCount(0)
  })

  test("every page loads in both views without console errors", async ({
    page,
  }) => {
    const tracked = trackErrors(page)
    await page.goto(studio)
    await signIn(page)
    await makeTheme(page, "Alpha")
    await makeTheme(page, "Beta")
    await chooseAction(page, "Archive")
    for (const view of ["view-grid", "view-list"]) {
      await page.getByTestId(view).click()
      for (const nav of ["nav-recents", "nav-templates", "nav-archive"]) {
        await page.getByTestId(nav).click()
        await expect(page.getByTestId("studio-home")).toBeVisible()
      }
    }
    tracked.expectNone()
  })

  test("a template can be archived and restored, signed out", async ({
    page,
  }) => {
    await page.goto(studio + "#/templates")
    await page.getByRole("button", { name: "Actions for Folio" }).click()
    await page.getByRole("menuitem", { name: "Archive" }).click()
    await expect(page.getByTestId("template-card")).toHaveCount(2)
    await expect(badge(page)).toHaveText("1")

    // It stays archived across a reload, and Archive holds it.
    await page.reload()
    await expect(page.getByTestId("template-card")).toHaveCount(2)
    await page.getByTestId("nav-archive").click()
    const archived = page.getByTestId("archived-card")
    await expect(archived).toHaveCount(1)
    await expect(archived).toHaveAccessibleName("Folio")
    // A template is part of Studio: it comes back, it is never deleted.
    await expect(page.getByTestId("theme-actions")).toHaveCount(0)

    await page.getByRole("button", { name: "Restore" }).click()
    await expect(page.getByText("Nothing archived")).toBeVisible()
    await page.getByTestId("nav-templates").click()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
  })

  test("a right-click on a card opens its actions", async ({ page }) => {
    await page.goto(studio + "#/templates")
    await page.getByTestId("template-card").first().click({ button: "right" })
    await page.getByRole("menuitem", { name: "Archive" }).click()
    await expect(page.getByTestId("template-card")).toHaveCount(2)
    await page.getByRole("button", { name: "Undo" }).click()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
  })

  test("search in the side panel lists and opens themes and templates", async ({
    page,
  }) => {
    await page.goto(studio)
    const search = page.getByTestId("search")
    // ⌘K puts the cursor in the field; the list opens under it, not as a modal.
    await page.keyboard.press("ControlOrMeta+k")
    await expect(search).toBeFocused()
    await expect(page.getByRole("dialog")).toHaveCount(0)
    await search.click()
    await expect(page.getByRole("option")).toHaveCount(3)
    await page.keyboard.press("Escape")

    // Signed in, the user's own themes are listed too.
    await signIn(page)
    await makeTheme(page, "My brand")
    await search.click()
    await expect(page.getByRole("option")).toHaveCount(4)
    await search.fill("my")
    await expect(page.getByRole("option")).toHaveCount(1)
    await page.getByRole("option", { name: /My brand/ }).click()
    await discardIfAsked(page)
    await expect(page.getByLabel("Theme name")).toHaveValue("My brand")

    await page.getByTestId("home-link").click()
    await page.getByTestId("search").fill("fol")
    await page.getByRole("option", { name: /Folio/ }).click()
    await discardIfAsked(page)
    await expect(page.getByLabel("Theme name")).toHaveValue("Folio")
  })

  test("on a phone the side panel is a sheet that closes on a pick", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(studio)
    await expect(page.getByTestId("nav-templates")).toBeHidden()
    await page.getByRole("button", { name: "Toggle Sidebar" }).click()
    await page.getByTestId("nav-templates").click()
    await expect(page).toHaveURL(/#\/templates$/)
    await expect(page.getByTestId("nav-templates")).toBeHidden()
    await expect(page.getByTestId("template-card")).toHaveCount(3)
  })
})
