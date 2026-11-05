import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
declare const sizes: {
    sm: {
        control: string;
        track: string;
        thumb: string;
        fillEnd: string;
        fillStart: string;
        dots: string;
    };
    default: {
        control: string;
        track: string;
        thumb: string;
        fillEnd: string;
        fillStart: string;
        dots: string;
    };
    lg: {
        control: string;
        track: string;
        thumb: string;
        fillEnd: string;
        fillStart: string;
        dots: string;
    };
};
declare function InsetSlider({ className, defaultValue, value, onValueChange, min, max, step, size, ticks, showMinMax, ...props }: Omit<SliderPrimitive.Root.Props, "orientation"> & {
    size?: keyof typeof sizes;
    /**
     * Draw a dot inside the track at every step the fill hasn't reached; the
     * dots under the fill and the thumb are hidden. Keep it to about 20 stops or
     * fewer.
     */
    ticks?: boolean;
    /** Show the current value before the track and the max after it. */
    showMinMax?: boolean;
}): React.JSX.Element;
export { InsetSlider };
