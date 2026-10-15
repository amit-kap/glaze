"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "../lib/utils.js";
// A switch that toggles between two icons instead of on/off alone: both
// icons stay visible in a pill track and a thumb slides behind the active
// one. The cells are `relative` so icons paint above the sliding thumb
// without z-index. Icon color and thumb position both follow data-checked.
const sizes = {
    sm: {
        root: "h-control-xs p-0.5",
        cell: "size-5 [&_svg:not([class*='size-'])]:size-3.5",
        // start offset = root padding; travel = one cell width.
        thumb: "inset-y-0.5 inset-s-0.5 size-5 data-checked:translate-x-5 rtl:data-checked:-translate-x-5",
    },
    default: {
        root: "h-control-md p-1",
        cell: "size-6 [&_svg:not([class*='size-'])]:size-4.5",
        thumb: "inset-y-1 inset-s-1 size-6 data-checked:translate-x-6 rtl:data-checked:-translate-x-6",
    },
};
function IconSwitch({ className, size = "default", icon, checkedIcon, ...props }) {
    const cell = cn("relative grid place-items-center", sizes[size].cell);
    return (_jsxs(SwitchPrimitive.Root, { "data-slot": "icon-switch", className: cn("group/icon-switch relative inline-flex shrink-0 items-center rounded-pill border bg-secondary transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 data-disabled:cursor-not-allowed data-disabled:opacity-50", sizes[size].root, className), ...props, children: [_jsx(SwitchPrimitive.Thumb, { "data-slot": "icon-switch-thumb", className: cn("pointer-events-none absolute rounded-pill bg-primary transition-transform duration-(--duration-moderate) ease-spring", sizes[size].thumb) }), _jsx("span", { "data-slot": "icon-switch-off-icon", className: cn(cell, "text-muted-foreground transition-colors duration-(--duration-moderate) group-data-[unchecked]/icon-switch:text-primary-foreground"), children: icon }), _jsx("span", { "data-slot": "icon-switch-on-icon", className: cn(cell, "text-muted-foreground transition-colors duration-(--duration-moderate) group-data-[checked]/icon-switch:text-primary-foreground"), children: checkedIcon })] }));
}
export { IconSwitch };
