import * as React from "react";
export type Mode = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";
type Settings = {
    theme: string;
    mode: Mode;
    density: Density;
};
type ThemeContextValue = Settings & {
    /** The mode actually shown: "system" resolved to light or dark. */
    resolvedMode: "light" | "dark";
    setTheme: (theme: string) => void;
    setMode: (mode: Mode) => void;
    setDensity: (density: Density) => void;
};
export type ThemeProviderProps = {
    children: React.ReactNode;
    /** Theme name, matching a `themes/<name>.css` you import. "default" is Nova. */
    defaultTheme?: string;
    defaultMode?: Mode;
    defaultDensity?: Density;
    /** localStorage key for the viewer's choice; `false` to not persist. */
    storageKey?: string | false;
};
export declare function ThemeProvider({ children, defaultTheme, defaultMode, defaultDensity, storageKey, }: ThemeProviderProps): React.JSX.Element;
export declare function useTheme(): ThemeContextValue;
/**
 * Inline script for <head> that applies the saved switches before the page
 * paints, so a dark or themed page doesn't flash the default first.
 * Pass the same defaults and storageKey as the ThemeProvider.
 */
export declare function themeScript({ defaultTheme, defaultMode, defaultDensity, storageKey, }?: Omit<ThemeProviderProps, "children">): string;
export {};
