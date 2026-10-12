import * as React from "react";
type HighlightLayerOptions = {
    /**
     * Which row the layer follows: the row Base UI marks data-highlighted
     * (menus, select, combobox), or the row under the pointer (tabs).
     */
    follow?: "highlighted" | "hover";
    /** hover only: the rows that may take the layer. */
    rows?: string;
};
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
export declare function useHighlightLayer<T extends HTMLElement>(forwardedRef?: React.Ref<T>, { follow, rows }?: HighlightLayerOptions): React.RefCallback<T>;
export {};
