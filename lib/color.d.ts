export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";
export type Rgba = {
    r: number;
    g: number;
    b: number;
    a: number;
};
export type Hsva = {
    h: number;
    s: number;
    v: number;
    a: number;
};
/** h in degrees, s and v in 0-1. */
export declare function hsvaToRgba({ h, s, v, a }: Hsva): Rgba;
/** `hue` is kept when the colour has none (greys), so dragging doesn't jump. */
export declare function rgbaToHsva({ r, g, b, a }: Rgba, hue?: number): Hsva;
export declare function rgbaToHsl({ r, g, b }: Rgba): {
    h: number;
    s: number;
    l: number;
};
export declare function hslToRgba(h: number, s: number, l: number, a?: number): Rgba;
/** l in 0-100, c roughly 0-0.4, h in degrees. */
export declare function rgbaToOklch({ r, g, b }: Rgba): {
    l: number;
    c: number;
    h: number;
};
export declare function oklchToRgba(l: number, c: number, h: number, a?: number): Rgba;
/** l in 0-100, a and b roughly -0.4-0.4. */
export declare function oklabToRgba(l: number, a: number, b: number, alpha?: number): Rgba;
/** Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), hsl(), oklch(), oklab()
    and color() — enough to read back computed getComputedStyle colours. */
export declare function parseColor(input: string): Rgba | null;
export declare function formatColor(color: Rgba, format: ColorFormat): string;
/** WCAG relative luminance, 0–1. Alpha is ignored: judge the colour, not the
    composite, so pills and overlays keep a stable reading. */
export declare function relativeLuminance({ r, g, b }: Rgba): number;
/** WCAG contrast ratio between two colours: 1 (none) to 21 (black on white). */
export declare function contrastRatio(a: Rgba, b: Rgba): number;
