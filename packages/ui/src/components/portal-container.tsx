"use client"

import * as React from "react"

const PortalContainerContext = React.createContext<HTMLElement | null>(null)

/**
 * Where popups render. By default every popup (select, menu, dialog, tooltip…)
 * mounts on the document body, outside whatever theme or scope its trigger
 * sits in. Wrap a themed region in this and they mount inside it instead, so
 * they inherit the region's theme tokens, dark mode and density.
 *
 * `container` is the element itself, so hold it in state, not a ref:
 * `const [el, setEl] = useState<HTMLElement | null>(null)`, then
 * `<div ref={setEl}>` and `<PortalContainer container={el}>`.
 *
 * Fixed-position layers (dialog, sheet, drawer) stay relative to the window
 * unless the container is a containing block for them, for example with
 * `contain: layout`.
 */
function PortalContainer({
  container,
  children,
}: {
  container: HTMLElement | null
  children: React.ReactNode
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

/**
 * The element popups mount into, or `undefined` for the document body. Not
 * `null`: Base UI reads an explicit `null` container as "nowhere" and renders
 * nothing, so an unwrapped popup would never open.
 */
function usePortalContainer() {
  return React.useContext(PortalContainerContext) ?? undefined
}

export { PortalContainer, usePortalContainer }
