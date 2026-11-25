import * as React from "react"

export type Route = "home" | "edit"

const read = (): Route => (location.hash === "#/edit" ? "edit" : "home")

const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener)
  return () => window.removeEventListener("hashchange", listener)
}

export const hrefFor = (route: Route) => (route === "edit" ? "#/edit" : "#/")

/** The page, from the URL hash: `#/edit` is the editor, anything else Home. */
export function useRoute() {
  const route = React.useSyncExternalStore(subscribe, read)
  return { route, go: (to: Route) => void (location.hash = hrefFor(to)) }
}
