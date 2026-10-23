import { builtInThemes } from "@amit-kap/glaze/lib/config"
import nova from "@amit-kap/glaze/themes/nova.css?raw"

export type BaseTheme = (typeof builtInThemes)[number]
export const isBaseTheme = (v: string): v is BaseTheme =>
  (builtInThemes as readonly string[]).includes(v)

// The built-in theme's stylesheet, for reading defaults and generating CSS.
export const baseCss: Record<BaseTheme, string> = { nova }
