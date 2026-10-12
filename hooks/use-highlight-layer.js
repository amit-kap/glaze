import * as React from "react";
/**
 * Drives the highlight-scope layer: one ::after per list that moves to the
 * current row instead of each row switching its own background. The row is
 * measured with offset* (immune to the popup's open/close scale) and written
 * to --highlight-x/-y/-w/-h on the scope, which the layer reads through
 * translate, width and height. data-highlight marks that a row is lit; on a
 * fresh entry data-highlight-entering suppresses the travel for one style
 * pass, so the layer appears on its row rather than sliding in from where
 * it last was.
 *
 * Returns a callback ref for the scope element (it must be the positioned,
 * scrolling container of the rows). An existing ref is merged in.
 */
export function useHighlightLayer(forwardedRef, { follow = "highlighted", rows = "" } = {}) {
    return React.useCallback((scope) => {
        setRef(forwardedRef, scope);
        if (!scope)
            return;
        let current = null;
        const place = (row) => {
            current = row;
            if (!row) {
                // Keep the last position so the layer fades out where it was.
                scope.removeAttribute("data-highlight");
                return;
            }
            const entering = !scope.hasAttribute("data-highlight");
            if (entering)
                scope.setAttribute("data-highlight-entering", "");
            const { x, y } = offsetWithin(row, scope);
            scope.style.setProperty("--highlight-x", `${x}px`);
            scope.style.setProperty("--highlight-y", `${y}px`);
            scope.style.setProperty("--highlight-w", `${row.offsetWidth}px`);
            scope.style.setProperty("--highlight-h", `${row.offsetHeight}px`);
            scope.setAttribute("data-highlight", "");
            if (entering) {
                // Commit the new position with travel switched off, then restore
                // it; the restore changes nothing that could transition.
                void getComputedStyle(scope, "::after").translate;
                scope.removeAttribute("data-highlight-entering");
            }
        };
        // Rows reflow (a combobox filters, the popup resizes): re-measure.
        const resize = new ResizeObserver(() => {
            if (current?.isConnected)
                place(current);
        });
        resize.observe(scope);
        if (follow === "highlighted") {
            const sync = () => place(scope.querySelector("[data-highlighted]"));
            const mutations = new MutationObserver(sync);
            mutations.observe(scope, {
                subtree: true,
                childList: true,
                attributeFilter: ["data-highlighted"],
            });
            sync();
            return () => {
                mutations.disconnect();
                resize.disconnect();
                setRef(forwardedRef, null);
            };
        }
        const over = (event) => {
            if (event.pointerType === "touch")
                return;
            const row = event.target.closest(rows);
            place(row && scope.contains(row) ? row : null);
        };
        const leave = () => place(null);
        scope.addEventListener("pointerover", over);
        scope.addEventListener("pointerleave", leave);
        return () => {
            scope.removeEventListener("pointerover", over);
            scope.removeEventListener("pointerleave", leave);
            resize.disconnect();
            setRef(forwardedRef, null);
        };
    }, [forwardedRef, follow, rows]);
}
function offsetWithin(row, scope) {
    let x = 0;
    let y = 0;
    let node = row;
    while (node && node !== scope) {
        x += node.offsetLeft;
        y += node.offsetTop;
        const parent = node.offsetParent;
        if (parent !== scope && parent && !scope.contains(parent))
            break;
        node = parent;
    }
    return { x, y };
}
function setRef(ref, value) {
    if (typeof ref === "function")
        ref(value);
    else if (ref)
        ref.current = value;
}
