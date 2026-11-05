import * as React from "react";
import { type ColorFormat } from "../lib/color.js";
/** A token this colour writes, shown under the picker with its own values. */
type Dependent = {
    /** What the row is called; the token name reads well in a dense list. */
    label: string;
    value: string;
};
/** A colour as designers read it: lightness, chroma, hue — not as CSS. */
export declare function colorChannels(value: string): string | null;
/**
 * One colour, in a card: swatch, name, its OKLCH values and how readable it
 * is. Opening it reveals the picker and every token that follows this colour,
 * so a theme is edited where the consequences are visible.
 */
declare function ColorSelector({ label, value, onValueChange, description, contrast, dependents, edited, onReset, open, defaultOpen, onOpenChange, format: formatProp, defaultFormat, onFormatChange, className, }: {
    /** The row's name; also its accessible name. */
    label: string;
    /** Any CSS colour the picker can read. */
    value: string;
    /** Omit to show the value without a picker. */
    onValueChange?: (value: string) => void;
    /** One line under the header, shown while open. */
    description?: string;
    /** The pair to judge readability on, when the colour is actually read. */
    contrast?: {
        foreground: string;
        background: string;
    };
    /** Tokens that read this colour. */
    dependents?: Dependent[];
    /** True when the colour differs from the theme it started from. */
    edited?: boolean;
    onReset?: () => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** The notation for every value in the card; defaults to OKLCH. */
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onFormatChange?: (format: ColorFormat) => void;
    className?: string;
}): React.JSX.Element;
/** The value a selector shows in its tooltip: full precision, one notation. */
export declare function colorReadout(value: string): string;
export { ColorSelector };
export type { Dependent as ColorSelectorDependent };
