import { useRender } from "@base-ui/react/use-render";
declare const sizes: {
    readonly xs: "size-4 rounded-pill";
    readonly sm: "size-6 rounded-pill";
    readonly md: "size-9 rounded-pill";
};
/**
 * A colour, drawn. The only way Glaze shows a colour value on its own: use it
 * in lists, drill-downs and headers, and let `ColorPicker` edit the value.
 * Decorative by default; pass `label` when the swatch is the only clue to what
 * the colour is, or `render` to make it a button.
 */
declare function ColorSwatch({ className, value, size, label, render, ...props }: useRender.ComponentProps<"span"> & {
    /** Any CSS colour the picker can read: hex, rgb(), hsl() or oklch(). */
    value: string;
    size?: keyof typeof sizes;
    /** Names the colour for assistive tech. Omit when text beside it does. */
    label?: string;
}): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export { ColorSwatch };
