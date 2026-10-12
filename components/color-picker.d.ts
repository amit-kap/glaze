import * as React from "react";
import { type ColorFormat, type Rgba } from "../lib/color.js";
type ColorPickerProps = {
    /** Any CSS colour the picker can read: hex, rgb(), hsl() or oklch(). */
    value?: string;
    defaultValue?: string;
    /** Called with the colour written in the current format. */
    onValueChange?: (value: string, color: Rgba) => void;
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onFormatChange?: (format: ColorFormat) => void;
    /** Colours to pick from; the row is hidden when omitted. */
    swatches?: string[];
    hideEyedropper?: boolean;
    /** Draw the picker in a card; the popover turns this off. */
    card?: boolean;
    className?: string;
};
declare function ColorPicker({ value, defaultValue, onValueChange, format: formatProp, defaultFormat, onFormatChange, swatches, hideEyedropper, card, className, }: ColorPickerProps): React.JSX.Element;
declare function ColorPickerPopover({ triggerLabel, triggerClassName, value, defaultValue, onValueChange, ...props }: ColorPickerProps & {
    triggerLabel?: string;
    triggerClassName?: string;
}): React.JSX.Element;
export { ColorPicker, ColorPickerPopover };
export type { ColorFormat, ColorPickerProps };
