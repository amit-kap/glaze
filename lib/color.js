// Colour parsing and conversion for the ColorPicker. Everything goes through
// sRGB: r, g, b are 0-255 and a is 0-1. OKLCH values outside sRGB are clamped.
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const round = (n, digits = 0) => {
    const f = 10 ** digits;
    return Math.round(n * f) / f;
};
// --- HSV ------------------------------------------------------------------
/** h in degrees, s and v in 0-1. */
export function hsvaToRgba({ h, s, v, a }) {
    const f = (n) => {
        const k = (n + h / 60) % 6;
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255, a };
}
/** `hue` is kept when the colour has none (greys), so dragging doesn't jump. */
export function rgbaToHsva({ r, g, b, a }, hue = 0) {
    const R = r / 255;
    const G = g / 255;
    const B = b / 255;
    const max = Math.max(R, G, B);
    const d = max - Math.min(R, G, B);
    let h = hue;
    if (d > 0) {
        if (max === R)
            h = ((G - B) / d) % 6;
        else if (max === G)
            h = (B - R) / d + 2;
        else
            h = (R - G) / d + 4;
        h = (h * 60 + 360) % 360;
    }
    return { h, s: max === 0 ? 0 : d / max, v: max, a };
}
// --- HSL ------------------------------------------------------------------
export function rgbaToHsl({ r, g, b }) {
    const { h, s: sv, v } = rgbaToHsva({ r, g, b, a: 1 });
    const l = v * (1 - sv / 2);
    const s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return { h, s: s * 100, l: l * 100 };
}
export function hslToRgba(h, s, l, a = 1) {
    const S = clamp(s, 0, 100) / 100;
    const L = clamp(l, 0, 100) / 100;
    const v = L + S * Math.min(L, 1 - L);
    return hsvaToRgba({
        h: ((h % 360) + 360) % 360,
        s: v === 0 ? 0 : 2 * (1 - L / v),
        v,
        a,
    });
}
// --- OKLCH ----------------------------------------------------------------
const toLinear = (c) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (x) => {
    const c = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return clamp(c, 0, 1) * 255;
};
/** l in 0-100, c roughly 0-0.4, h in degrees. */
export function rgbaToOklch({ r, g, b }) {
    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const c = Math.hypot(A, Bb);
    // Hue is meaningless for greys; report 0 rather than numeric noise.
    const h = c < 1e-4 ? 0 : ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360;
    return { l: L * 100, c, h };
}
export function oklchToRgba(l, c, h, a = 1) {
    const L = clamp(l, 0, 100) / 100;
    const A = Math.max(c, 0) * Math.cos((h * Math.PI) / 180);
    const B = Math.max(c, 0) * Math.sin((h * Math.PI) / 180);
    const l_ = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m_ = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s_ = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return {
        r: fromLinear(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
        g: fromLinear(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
        b: fromLinear(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
        a,
    };
}
// --- Parsing --------------------------------------------------------------
const hex2 = (n) => Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
// A CSS number or percentage, as a 0-1 fraction when it ends in %.
function channel(token, scale) {
    if (token === undefined)
        return null;
    const pct = token.endsWith("%");
    const n = Number.parseFloat(token);
    if (Number.isNaN(n))
        return null;
    return pct ? (n / 100) * scale : n;
}
function alphaOf(token) {
    if (token === undefined)
        return 1;
    const v = channel(token, 1);
    return v === null ? 1 : clamp(v, 0, 1);
}
/** Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), hsl() and oklch(). */
export function parseColor(input) {
    const text = input.trim().toLowerCase();
    const hex = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(text);
    if (hex) {
        let h = hex[1];
        if (h.length <= 4)
            h = [...h].map((c) => c + c).join("");
        const n = (i) => Number.parseInt(h.slice(i, i + 2), 16);
        return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
    }
    const fn = /^(rgba?|hsla?|oklch)\(\s*([^)]+?)\s*\)$/.exec(text);
    if (!fn)
        return null;
    const [body, alpha] = fn[2].split("/").map((s) => s.trim());
    const parts = body.split(/[\s,]+/).filter(Boolean);
    // Legacy comma syntax carries alpha as a fourth value.
    const a = alphaOf(alpha ?? (parts.length > 3 ? parts[3] : undefined));
    const [p0, p1, p2] = parts;
    if (fn[1].startsWith("rgb")) {
        const r = channel(p0, 255);
        const g = channel(p1, 255);
        const b = channel(p2, 255);
        if (r === null || g === null || b === null)
            return null;
        return { r: clamp(r, 0, 255), g: clamp(g, 0, 255), b: clamp(b, 0, 255), a };
    }
    if (fn[1].startsWith("hsl")) {
        const h = channel(p0, 360);
        const s = channel(p1, 100);
        const l = channel(p2, 100);
        if (h === null || s === null || l === null)
            return null;
        return hslToRgba(h, s, l, a);
    }
    const l = channel(p0, 100);
    const c = channel(p1, 0.4);
    const h = channel(p2, 360);
    if (l === null || c === null || h === null)
        return null;
    // A bare lightness is 0-1 in CSS oklch(); a percentage is 0-100.
    return oklchToRgba(p0.endsWith("%") ? l : l * 100, c, h, a);
}
// --- Formatting -----------------------------------------------------------
export function formatColor(color, format) {
    const { r, g, b, a } = color;
    const alpha = a < 1 ? ` / ${round(a * 100)}%` : "";
    switch (format) {
        case "hex":
            return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 1 ? hex2(a * 255) : ""}`;
        case "rgb":
            return `rgb(${round(r)} ${round(g)} ${round(b)}${alpha})`;
        case "hsl": {
            const { h, s, l } = rgbaToHsl(color);
            return `hsl(${round(h)} ${round(s)}% ${round(l)}%${alpha})`;
        }
        case "oklch": {
            const { l, c, h } = rgbaToOklch(color);
            return `oklch(${round(l, 1)}% ${round(c, 3)} ${round(h, 1)}${alpha})`;
        }
    }
}
