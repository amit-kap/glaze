import * as React from "react"

export type Route = "home" | "templates" | "archive" | "edit"

const hashes: Record<Route, string> = {
  home: "#/",
  templates: "#/templates",
  archive: "#/archive",
  edit: "#/edit",
}

const read = (): Route =>
  (Object.keys(hashes) as Route[]).find(
    (route) => hashes[route] === location.hash
  ) ?? "home"

const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener)
  return () => window.removeEventListener("hashchange", listener)
}

export const hrefFor = (route: Route) => hashes[route]

/**
 * The page, from the URL hash: `#/edit` is the editor, `#/templates` and
 * `#/archive` the other files pages, anything else Recents.
 */
export function useRoute() {
  const route = React.useSyncExternalStore(subscribe, read)
  return { route, go: (to: Route) => void (location.hash = hrefFor(to)) }
}
