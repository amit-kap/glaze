"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Tabs, TabsList, TabsTrigger } from "./tabs.js";
import { cn } from "../lib/utils.js";
// One choice from a short, always-visible set: mode, density, viewport.
// Drawn with Tabs' segmented face — a muted track, a sliding pill behind the
// active option — so it keeps the same indicator animation and focus ring as
// Tabs instead of re-implementing them. Reach for ToggleGroup when options can
// be combined, and Select when the list is too long to show at once.
function SegmentedControl({ className, label, size = "sm", value, onValueChange, options, }) {
    return (_jsx(Tabs, { value: value, onValueChange: (next) => onValueChange(next), children: _jsx(TabsList, { size: size, "aria-label": label, 
            // The same hairline border as the inset slider's capsule.
            className: cn("ring-1 ring-border ring-inset", className), children: options.map((option) => (_jsx(TabsTrigger, { value: option.value, disabled: option.disabled, children: option.label }, option.value))) }) }));
}
export { SegmentedControl };
