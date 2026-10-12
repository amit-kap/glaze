import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "../lib/utils.js";
import { toggleVariants } from "./toggle.js";
const ToggleGroupContext = React.createContext({
    size: "default",
    variant: "default",
    spacing: 2,
    orientation: "horizontal",
});
function ToggleGroup({ className, variant, size, spacing = 2, orientation = "horizontal", children, ...props }) {
    return (_jsx(ToggleGroupPrimitive, { "data-slot": "toggle-group", "data-variant": variant, "data-size": size, "data-spacing": spacing, "data-orientation": orientation, style: { "--gap": spacing }, className: cn("group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-control data-[size=sm]:rounded-(--button-radius-xs) data-vertical:flex-col data-vertical:items-stretch", className), ...props, children: _jsx(ToggleGroupContext.Provider, { value: { variant, size, spacing, orientation }, children: children }) }));
}
function ToggleGroupItem({ className, children, variant = "default", size = "default", ...props }) {
    const context = React.useContext(ToggleGroupContext);
    return (_jsx(TogglePrimitive, { "data-slot": "toggle-group-item", "data-variant": context.variant || variant, "data-size": context.size || size, "data-spacing": context.spacing, className: cn("shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pe-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:ps-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-control group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-control group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-control group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-control group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t group-data-[spacing=0]/toggle-group:data-[variant=default]:data-pressed:rounded-control group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=default]:data-pressed:[[data-pressed]+&]:rounded-s-none group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=default]:data-pressed:has-[+[data-pressed]]:rounded-e-none group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=default]:data-pressed:[[data-pressed]+&]:rounded-t-none group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=default]:data-pressed:has-[+[data-pressed]]:rounded-b-none", toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
        }), className), ...props, children: children }));
}
export { ToggleGroup, ToggleGroupItem };
