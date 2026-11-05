import * as React from "react";
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
declare function PortalContainer({ container, children, }: {
    container: HTMLElement | null;
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * The element popups mount into, or `undefined` for the document body. Not
 * `null`: Base UI reads an explicit `null` container as "nowhere" and renders
 * nothing, so an unwrapped popup would never open.
 */
declare function usePortalContainer(): HTMLElement | undefined;
export { PortalContainer, usePortalContainer };
