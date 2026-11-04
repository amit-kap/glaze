import type { Stored } from "./draft"

/** One theme as a file: the same shape the library keeps, with a version. */
export type ThemeFile = {
  format: "glaze-studio-theme"
  version: 1
  name: string
  data: Stored
}

export const themeFile = (name: string, data: Stored): ThemeFile => ({
  format: "glaze-studio-theme",
  version: 1,
  name,
  data,
})

/** The theme in a file's text, or why it can't be read. */
export function readThemeFile(
  text: string
): { name: string; data: Stored } | { error: string } {
  try {
    const parsed = JSON.parse(text)
    if (parsed?.format !== "glaze-studio-theme")
      return { error: "This isn't a Glaze Studio theme file." }
    if (parsed.version !== 1)
      return { error: "This theme file is from a newer Studio." }
    if (!parsed.data?.theme) return { error: "The theme file is empty." }
    return {
      name: typeof parsed.name === "string" ? parsed.name : "Imported theme",
      data: parsed.data,
    }
  } catch {
    return { error: "The file isn't valid JSON." }
  }
}

/** Save text as a file through the browser's download. */
export function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
