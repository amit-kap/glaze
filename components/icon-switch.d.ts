import type { ReactNode } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
declare const sizes: {
    sm: {
        root: string;
        cell: string;
        thumb: string;
    };
    default: {
        root: string;
        cell: string;
        thumb: string;
    };
};
declare function IconSwitch({ className, size, icon, checkedIcon, ...props }: SwitchPrimitive.Root.Props & {
    /** Icon for the unchecked (start) side. */
    icon: ReactNode;
    /** Icon for the checked (end) side. */
    checkedIcon: ReactNode;
    size?: keyof typeof sizes;
}): import("react").JSX.Element;
export { IconSwitch };
