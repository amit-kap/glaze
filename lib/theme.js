"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const ThemeContext = React.createContext(null);
const darkQuery = "(prefers-color-scheme: dark)";
function read(storageKey) {
    try {
        return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    }
    catch {
        return {};
    }
}
function write(storageKey, settings) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
    }
    catch {
        // Storage blocked (private window, disabled site data): keep in memory.
    }
}
function apply(root, settings, dark) {
    root.setAttribute("data-theme", settings.theme);
    root.classList.toggle("dark", dark);
    if (settings.density === "compact")
        root.setAttribute("data-density", "compact");
    else
        root.removeAttribute("data-density");
}
export function ThemeProvider({ children, defaultTheme = "nova", defaultMode = "system", defaultDensity = "comfortable", storageKey = "glaze", }) {
    const [settings, setSettings] = React.useState(() => ({
        theme: defaultTheme,
        mode: defaultMode,
        density: defaultDensity,
        ...(storageKey && typeof window !== "undefined" ? read(storageKey) : {}),
    }));
    const [systemDark, setSystemDark] = React.useState(() => typeof window !== "undefined" && window.matchMedia(darkQuery).matches);
    React.useEffect(() => {
        const query = window.matchMedia(darkQuery);
        const onChange = () => setSystemDark(query.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);
    const resolvedMode = settings.mode === "system" ? (systemDark ? "dark" : "light") : settings.mode;
    React.useLayoutEffect(() => {
        apply(document.documentElement, settings, resolvedMode === "dark");
        if (storageKey)
            write(storageKey, settings);
    }, [settings, resolvedMode, storageKey]);
    const value = React.useMemo(() => ({
        ...settings,
        resolvedMode,
        setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
        setMode: (mode) => setSettings((s) => ({ ...s, mode })),
        setDensity: (density) => setSettings((s) => ({ ...s, density })),
    }), [settings, resolvedMode]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context)
        throw new Error("useTheme must be used inside <ThemeProvider>");
    return context;
}
/**
 * Inline script for <head> that applies the saved switches before the page
 * paints, so a dark or themed page doesn't flash the default first.
 * Pass the same defaults and storageKey as the ThemeProvider.
 */
export function themeScript({ defaultTheme = "nova", defaultMode = "system", defaultDensity = "comfortable", storageKey = "glaze", } = {}) {
    const defaults = JSON.stringify({ theme: defaultTheme, mode: defaultMode, density: defaultDensity });
    const key = JSON.stringify(storageKey || "");
    return `(function(){try{var s=${defaults},k=${key};if(k){var v=JSON.parse(localStorage.getItem(k)||"{}");for(var p in v)s[p]=v[p]}var r=document.documentElement;r.setAttribute("data-theme",s.theme);var d=s.mode==="dark"||(s.mode==="system"&&matchMedia("${darkQuery}").matches);r.classList.toggle("dark",d);if(s.density==="compact")r.setAttribute("data-density","compact")}catch(e){}})()`;
}
