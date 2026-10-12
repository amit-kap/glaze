import { builtInThemes } from "@amit-kap/glaze/lib/config"
import nova from "@amit-kap/glaze/themes/nova.css?raw"
import vega from "@amit-kap/glaze/themes/vega.css?raw"
import maia from "@amit-kap/glaze/themes/maia.css?raw"
import lyra from "@amit-kap/glaze/themes/lyra.css?raw"
import mira from "@amit-kap/glaze/themes/mira.css?raw"
import luma from "@amit-kap/glaze/themes/luma.css?raw"
import sera from "@amit-kap/glaze/themes/sera.css?raw"
import rhea from "@amit-kap/glaze/themes/rhea.css?raw"
import gr8r from "@amit-kap/glaze/themes/gr8r.css?raw"

export type BaseTheme = (typeof builtInThemes)[number]
export const isBaseTheme = (v: string): v is BaseTheme =>
  (builtInThemes as readonly string[]).includes(v)

// Every built-in theme's stylesheet, for reading defaults and generating CSS.
export const baseCss: Record<BaseTheme, string> = {
  nova,
  vega,
  maia,
  lyra,
  mira,
  luma,
  sera,
  rhea,
  gr8r,
}
