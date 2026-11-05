"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { contrastRatio, parseColor } from "../lib/color.js";
import { Badge } from "./badge.js";
import { Tooltip, TooltipContent, TooltipTrigger, } from "./tooltip.js";
/** The WCAG level a ratio reaches, as the label the badge shows. */
function contrastLevel(ratio) {
    if (ratio >= 7)
        return "AAA";
    if (ratio >= 4.5)
        return "AA";
    if (ratio >= 3)
        return "AA Large";
    return "Fail";
}
/**
 * How readable one colour is on another, as AA / AAA / Fail. Hovering shows
 * the ratio. Sits on the colour that does the reading — text on a fill, an
 * icon on a surface — so the pair is never ambiguous. Alpha is ignored;
 * contrast is judged on the colour itself.
 */
function ContrastBadge({ foreground, background, className, }) {
    const fg = parseColor(foreground);
    const bg = parseColor(background);
    if (!fg || !bg)
        return null;
    const ratio = contrastRatio(fg, bg);
    const level = contrastLevel(ratio);
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: _jsx(Badge, { variant: level === "Fail" ? "destructive" : "outline", className: className }), children: level }), _jsxs(TooltipContent, { children: [ratio.toFixed(2), ":1"] })] }));
}
export { ContrastBadge, contrastLevel };
