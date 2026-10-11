import type { GlazeConfig } from "./config.js";
type Block = Map<string, string>;
type Kind = "light" | "dark" | "pins";
/**
 * A theme file's declarations by rule kind, e.g. `readThemeCss(css).dark.get("--brand")`.
 * Only what the file itself sets: optional inputs it leaves out come from Nova.
 */
export declare const readThemeCss: (css: string) => Record<Kind, Block>;
/**
 * Builds the theme stylesheet for a parsed config.
 * @param baseCss the CSS of the theme named in `config.extends`
 */
export declare function generateThemeCss(config: GlazeConfig, baseCss: string): string;
/** Reads the config embedded in a generated theme file, if there is one. */
export declare function readEmbeddedConfig(css: string): unknown;
export {};
