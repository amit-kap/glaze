import { jsx as _jsx } from "react/jsx-runtime";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "../lib/utils.js";
function Collapsible({ ...props }) {
    return _jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({ ...props }) {
    return (_jsx(CollapsiblePrimitive.Trigger, { "data-slot": "collapsible-trigger", ...props }));
}
// Base UI measures the open panel into --collapsible-panel-height, so the
// height can transition to and from 0 without height: auto.
function CollapsibleContent({ className, ...props }) {
    return (_jsx(CollapsiblePrimitive.Panel, { "data-slot": "collapsible-content", className: cn("h-(--collapsible-panel-height) overflow-clip transition-[height] duration-(--duration-moderate) ease-standard data-ending-style:h-0 data-starting-style:h-0", className), ...props }));
}
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
