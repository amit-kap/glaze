import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button.js";
declare const sizes: {
    xs: {
        button: string;
        gap: number;
    };
    sm: {
        button: string;
        gap: number;
    };
    default: {
        button: string;
        gap: number;
    };
    lg: {
        button: string;
        gap: number;
    };
};
type RevealButtonSize = keyof typeof sizes;
declare function RevealButton({ className, variant, size, iconSide, label, children, ...props }: ButtonPrimitive.Props & Omit<VariantProps<typeof buttonVariants>, "size"> & {
    /** Revealed beside the icon while hovered or focused; also the name. */
    label: string;
    size?: RevealButtonSize;
    iconSide?: "start" | "end";
}): import("react").JSX.Element;
export { RevealButton };
