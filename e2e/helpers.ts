import { expect, type Page } from "@playwright/test"

/** Collect uncaught errors and console errors; assert none at the end. */
export function trackErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() !== "error") return
    const text = message.text()
    // Font/CDN requests can fail offline; they aren't app errors.
    if (/Failed to load resource|net::ERR_/.test(text)) return
    errors.push(text)
  })
  return {
    errors,
    expectNone: () => expect(errors, errors.join("\n")).toEqual([]),
  }
}
