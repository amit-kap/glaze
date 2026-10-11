import { jsx as _jsx } from "react/jsx-runtime";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.js";
import { trimText } from "../lib/label.js";
const toggleVariants = cva("group/toggle inline-flex items-center justify-center-safe gap-1 rounded-control text-body font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--icon-size)", {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent hover:bg-muted",
        },
        size: {
            default: "h-control-md min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
            sm: "h-control-sm min-w-7 rounded-(--button-radius-sm) px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
            lg: "h-control-lg min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Toggle({ className, variant = "default", size = "default", children, ...props }) {
    return (_jsx(TogglePrimitive, { "data-slot": "toggle", className: cn(toggleVariants({ variant, size, className })), ...props, children: trimText(children) }));
}
export { Toggle, toggleVariants };
