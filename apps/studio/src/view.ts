import * as React from "react"

export type View = "grid" | "list"

const viewKey = "glaze-studio-view-v1"

function read(): View {
  try {
    return localStorage.getItem(viewKey) === "list" ? "list" : "grid"
  } catch {
    return "grid"
  }
}

/** Grid or list for the files pages, remembered in this browser. */
export function useView() {
  const [view, setView] = React.useState(read)
  const choose = React.useCallback((next: View) => {
    setView(next)
    try {
      localStorage.setItem(viewKey, next)
    } catch {
      /* Storage can be unavailable; the choice lasts for this visit. */
    }
  }, [])
  return [view, choose] as const
}
