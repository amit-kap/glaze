"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { PipetteIcon } from "lucide-react";
import { cn } from "../lib/utils.js";
import { formatColor, hsvaToRgba, hslToRgba, oklchToRgba, parseColor, rgbaToHsl, rgbaToHsva, rgbaToOklch, } from "../lib/color.js";
import { Button } from "./button.js";
import { Card, CardContent } from "./card.js";
import { Input } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger, } from "./popover.js";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "./select.js";
import { Slider } from "./slider.js";
import { Tooltip, TooltipContent, TooltipTrigger, } from "./tooltip.js";
const formats = [
    { value: "hex", label: "HEX" },
    { value: "rgb", label: "RGB" },
    { value: "hsl", label: "HSL" },
    { value: "oklch", label: "OKLCH" },
];
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const css = (c) => `rgb(${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)} / ${c.a})`;
// A checkerboard under a colour, so transparency reads as transparency.
const checker = "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px";
function useHsva(value, defaultValue) {
    const [hsva, setHsva] = React.useState(() => rgbaToHsva(parseColor(value ?? defaultValue) ?? { r: 0, g: 0, b: 0, a: 1 }));
    // A controlled value that isn't what we last reported is an outside change.
    const [seen, setSeen] = React.useState(value);
    if (value !== undefined && value !== seen) {
        setSeen(value);
        const parsed = parseColor(value);
        if (parsed)
            setHsva((h) => rgbaToHsva(parsed, h.h));
    }
    return [hsva, setHsva, setSeen];
}
function ColorPicker({ value, defaultValue = "#6B97FF", onValueChange, format: formatProp, defaultFormat = "hex", onFormatChange, swatches, hideEyedropper = false, card = true, className, }) {
    const [hsva, setHsva, setSeen] = useHsva(value, defaultValue);
    const [formatState, setFormatState] = React.useState(defaultFormat);
    const format = formatProp ?? formatState;
    const rgba = hsvaToRgba(hsva);
    const areaRef = React.useRef(null);
    const canPick = !hideEyedropper && typeof window !== "undefined" && "EyeDropper" in window;
    // Every change comes through here: keep the hue for greys, then report.
    const commit = (next, nextFormat = format) => {
        setHsva(next);
        const out = formatColor(hsvaToRgba(next), nextFormat);
        setSeen(out);
        onValueChange?.(out, hsvaToRgba(next));
    };
    const commitRgba = (next) => commit(rgbaToHsva(next, hsva.h));
    const changeFormat = (next) => {
        setFormatState(next);
        onFormatChange?.(next);
        commit(hsva, next);
    };
    // --- Saturation/value area ---------------------------------------------
    const pickAt = (event) => {
        const box = areaRef.current?.getBoundingClientRect();
        if (!box)
            return;
        commit({
            ...hsva,
            s: clamp((event.clientX - box.left) / box.width, 0, 1),
            v: 1 - clamp((event.clientY - box.top) / box.height, 0, 1),
        });
    };
    const onAreaKey = (event) => {
        const step = event.shiftKey ? 0.1 : 0.01;
        const move = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
        };
        const [ds, dv] = move[event.key] ?? [];
        if (ds === undefined)
            return;
        event.preventDefault();
        commit({
            ...hsva,
            s: clamp(hsva.s + ds, 0, 1),
            v: clamp(hsva.v + dv, 0, 1),
        });
    };
    const eyedrop = async () => {
        try {
            const { sRGBHex } = await new window.EyeDropper().open();
            const parsed = parseColor(sRGBHex);
            if (parsed)
                commitRgba({ ...parsed, a: hsva.a });
        }
        catch {
            // Dismissed with Escape.
        }
    };
    // --- Channel fields -----------------------------------------------------
    const hsl = rgbaToHsl(rgba);
    const oklch = rgbaToOklch(rgba);
    const withAlpha = (c) => ({ ...c, a: hsva.a });
    const fields = format === "rgb"
        ? ["r", "g", "b"].map((k) => ({
            label: k.toUpperCase(),
            value: rgba[k],
            min: 0,
            max: 255,
            set: (n) => commitRgba({ ...rgba, [k]: n }),
        }))
        : format === "hsl"
            ? [
                {
                    label: "H",
                    value: hsl.h,
                    min: 0,
                    max: 360,
                    set: (n) => commitRgba(withAlpha(hslToRgba(n, hsl.s, hsl.l))),
                },
                {
                    label: "S",
                    value: hsl.s,
                    min: 0,
                    max: 100,
                    set: (n) => commitRgba(withAlpha(hslToRgba(hsl.h, n, hsl.l))),
                },
                {
                    label: "L",
                    value: hsl.l,
                    min: 0,
                    max: 100,
                    set: (n) => commitRgba(withAlpha(hslToRgba(hsl.h, hsl.s, n))),
                },
            ]
            : format === "oklch"
                ? [
                    {
                        label: "L",
                        value: oklch.l,
                        digits: 1,
                        min: 0,
                        max: 100,
                        set: (n) => commitRgba(withAlpha(oklchToRgba(n, oklch.c, oklch.h))),
                    },
                    {
                        label: "C",
                        value: oklch.c,
                        digits: 3,
                        min: 0,
                        max: 0.4,
                        set: (n) => commitRgba(withAlpha(oklchToRgba(oklch.l, n, oklch.h))),
                    },
                    {
                        label: "H",
                        value: oklch.h,
                        digits: 1,
                        min: 0,
                        max: 360,
                        set: (n) => commitRgba(withAlpha(oklchToRgba(oklch.l, oklch.c, n))),
                    },
                ]
                : [];
    const hueColor = css(hsvaToRgba({ h: hsva.h, s: 1, v: 1, a: 1 }));
    const solid = css({ ...rgba, a: 1 });
    const content = (_jsxs(_Fragment, { children: [_jsx("div", { ref: areaRef, "data-slot": "color-picker-area", role: "group", "aria-label": "Saturation and brightness", tabIndex: 0, className: "relative h-36 w-full cursor-crosshair touch-none rounded-control outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/25", style: {
                    background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, ${hueColor})`,
                }, onPointerDown: (event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    pickAt(event);
                }, onPointerMove: (event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId))
                        pickAt(event);
                }, onKeyDown: onAreaKey, children: _jsx("span", { "data-slot": "color-picker-thumb", className: "pointer-events-none absolute size-3.5 -translate-1/2 rounded-pill", style: {
                        left: `${hsva.s * 100}%`,
                        top: `${(1 - hsva.v) * 100}%`,
                        backgroundColor: solid,
                        // White with a dark hairline reads on any colour, in any theme.
                        border: "2px solid white",
                        boxShadow: "0 0 0 1px rgb(0 0 0 / 0.3)",
                    } }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-3", children: [_jsx(Slider, { "aria-label": "Hue", min: 0, max: 360, step: 1, value: [hsva.h], onValueChange: (v) => commit({ ...hsva, h: Array.isArray(v) ? v[0] : v }), className: "**:data-[slot=slider-range]:bg-transparent! **:data-[slot=slider-track]:h-2.5! **:data-[slot=slider-track]:bg-[linear-gradient(to_right,red,#ff0,#0f0,#0ff,#00f,#f0f,red)]!" }), _jsx(Slider, { "aria-label": "Opacity", min: 0, max: 100, step: 1, value: [Math.round(hsva.a * 100)], onValueChange: (v) => commit({ ...hsva, a: (Array.isArray(v) ? v[0] : v) / 100 }), style: {
                                    ["--alpha-track"]: `linear-gradient(to right, transparent, ${solid}), ${checker}`,
                                }, className: "**:data-[slot=slider-range]:bg-transparent! **:data-[slot=slider-track]:h-2.5! **:data-[slot=slider-track]:[background:var(--alpha-track)]!" })] }), _jsx("span", { "data-slot": "color-picker-preview", "aria-hidden": "true", className: "size-9 shrink-0 rounded-control border border-border", style: {
                            background: `linear-gradient(${css(rgba)}, ${css(rgba)}), ${checker}`,
                        } })] }), _jsxs("div", { className: cn("grid items-end gap-1.5", format === "hex"
                    ? "grid-cols-[minmax(0,1fr)_4rem]"
                    : "grid-cols-[repeat(3,minmax(0,1fr))_4rem]"), children: [_jsxs(Select, { items: formats, value: format, onValueChange: (v) => v && changeFormat(v), children: [_jsx(SelectTrigger, { size: "sm", "aria-label": "Colour format", className: cn("w-full", format !== "hex" && "col-span-3"), children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: _jsx(SelectGroup, { children: formats.map((f) => (_jsx(SelectItem, { value: f.value, children: f.label }, f.value))) }) })] }), canPick ? (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { render: _jsx(Button, { variant: "outline", size: "icon-sm", "aria-label": "Pick a colour from the screen", className: "w-full", onClick: eyedrop }), children: _jsx(PipetteIcon, {}) }), _jsx(TooltipContent, { children: "Eyedropper" })] })) : (_jsx("span", {})), format === "hex" ? (_jsx(ChannelField, { ariaLabel: "Hex", text: formatColor({ ...rgba, a: 1 }, "hex"), onCommit: (text) => {
                            const parsed = parseColor(text);
                            if (parsed)
                                commitRgba({ ...parsed, a: hsva.a });
                        } })) : (fields.map((f) => (_jsx(ChannelField, { label: f.label, text: String(Number(f.value.toFixed(f.digits ?? 0))), onCommit: (text) => {
                            const n = Number.parseFloat(text);
                            if (!Number.isNaN(n))
                                f.set(clamp(n, f.min, f.max));
                        } }, f.label)))), _jsx(ChannelField, { ariaLabel: "Opacity", text: `${Math.round(hsva.a * 100)}%`, onCommit: (text) => {
                            const n = Number.parseFloat(text);
                            if (!Number.isNaN(n))
                                commit({ ...hsva, a: clamp(n, 0, 100) / 100 });
                        } })] }), swatches && swatches.length > 0 && (_jsx("div", { "data-slot": "color-picker-swatches", className: "flex flex-wrap gap-1.5", children: swatches.map((swatch) => {
                    const parsed = parseColor(swatch);
                    if (!parsed)
                        return null;
                    const active = formatColor(parsed, "hex") === formatColor(rgba, "hex");
                    return (_jsx("button", { type: "button", "aria-label": swatch, "aria-pressed": active, onClick: () => commitRgba(parsed), className: "size-6 cursor-pointer rounded-item border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/25 aria-pressed:ring-2 aria-pressed:ring-ring", style: {
                            background: `linear-gradient(${css(parsed)}, ${css(parsed)}), ${checker}`,
                        } }, swatch));
                }) }))] }));
    return card ? (_jsx(Card, { "data-slot": "color-picker", size: "sm", className: cn("w-full min-w-0", className), children: _jsx(CardContent, { className: "flex flex-col gap-3", children: content }) })) : (_jsx("div", { "data-slot": "color-picker", className: cn("flex w-full min-w-0 flex-col gap-3", className), children: content }));
}
// A labelled text field that takes edits freely and applies them on blur or
// Enter; text that doesn't parse reverts to the current value.
function ChannelField({ label, ariaLabel, text, onCommit, className, }) {
    const [draft, setDraft] = React.useState(null);
    const done = () => {
        if (draft !== null)
            onCommit(draft);
        setDraft(null);
    };
    return (_jsxs("label", { className: cn("flex min-w-0 flex-col gap-1", className), children: [label && (_jsx("span", { className: "text-caption text-muted-foreground", children: label })), _jsx(Input, { "aria-label": label ? undefined : ariaLabel, value: draft ?? text, spellCheck: false, autoComplete: "off", className: "h-control-sm px-2 font-mono text-caption md:text-caption", onChange: (event) => setDraft(event.target.value), onBlur: done, onKeyDown: (event) => {
                    if (event.key === "Enter")
                        done();
                    if (event.key === "Escape")
                        setDraft(null);
                } })] }));
}
// A button showing the colour, opening the picker in a popover.
function ColorPickerPopover({ triggerLabel, triggerClassName, value, defaultValue = "#6B97FF", onValueChange, ...props }) {
    const [state, setState] = React.useState(defaultValue);
    const current = value ?? state;
    const parsed = parseColor(current);
    return (_jsxs(Popover, { children: [_jsxs(PopoverTrigger, { render: _jsx(Button, { variant: "outline", size: "sm", className: cn("justify-start", triggerClassName) }), children: [_jsx("span", { "aria-hidden": "true", className: "size-4 shrink-0 rounded-item border border-border", style: {
                            background: parsed
                                ? `linear-gradient(${css(parsed)}, ${css(parsed)}), ${checker}`
                                : undefined,
                        } }), triggerLabel && _jsx("span", { children: triggerLabel }), _jsx("span", { className: "font-mono text-caption text-muted-foreground", children: current })] }), _jsx(PopoverContent, { align: "start", className: "w-72", children: _jsx(ColorPicker, { ...props, card: false, value: current, onValueChange: (next, color) => {
                        setState(next);
                        onValueChange?.(next, color);
                    } }) })] }));
}
export { ColorPicker, ColorPickerPopover };
