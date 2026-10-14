import * as React from "react"

import { useTheme } from "@amit-kap/glaze/theme"

import { CustomizeSidebar } from "../customize-sidebar"
import { SettingsBar } from "./settings-bar"
import {
  loadCustomTheme,
  saveCustomTheme,
  type CustomThemeState,
} from "./custom-theme-store"
import {
  emptyCustom,
  isBaseTheme,
  isCustomized,
  themeCss,
  themeDefaults,
  toConfig,
  type Custom,
} from "../theme-builder"

const styleId = "glaze-showcase-custom"

// Settings bar built from Glaze components, floating at the bottom of the
// page, and the Customize sidebar it opens. Picking a theme and mode previews
// the built-in themes; the sidebar shows the chosen theme's values, and
// changing any of them builds a theme of its own on top of it, applied live
// and ready to download.
export function ControlPanel({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { theme, setTheme, mode, setMode, resolvedMode, density } = useTheme()
  const [copied, setCopied] = React.useState(false)
  const [state, setState] = React.useState<CustomThemeState>(
    () =>
      loadCustomTheme() ?? {
        base: isBaseTheme(theme) ? theme : "nova",
        custom: emptyCustom,
      }
  )
  const { base, custom } = state
  const defaults = React.useMemo(() => themeDefaults(base), [base])
  const customized = isCustomized(custom)
  const config = toConfig(base, custom, mode, density)
  const result = customized ? themeCss(config) : null
  const css = result && "css" in result ? result.css : null
  const error = result && "error" in result ? result.error : null

  // The setup command for what's picked: a built-in theme with its options,
  // or the downloaded config once the theme is customized.
  const command = customized
    ? "npx @amit-kap/glaze init --config glaze.config.json"
    : [
        "npx @amit-kap/glaze init",
        base !== "nova" && `--theme ${base}`,
        mode !== "system" && `--mode ${mode}`,
        density !== "comfortable" && `--density ${density}`,
      ]
        .filter(Boolean)
        .join(" ")

  const setCustom = (update: (c: Custom) => Custom) =>
    setState((s) => ({ ...s, custom: update(s.custom) }))

  const reset = () =>
    setState((s) => ({ ...s, custom: { ...emptyCustom, name: s.custom.name } }))

  React.useEffect(() => saveCustomTheme(state), [state])

  // Apply the custom theme live: its stylesheet (minus the @imports, whose
  // fonts the showcase already loads) and its name on <html>.
  React.useEffect(() => {
    let style = document.getElementById(styleId)
    if (!css) return style?.remove()
    if (!style) {
      style = Object.assign(document.createElement("style"), { id: styleId })
      document.head.append(style)
    }
    style.textContent = css.replace(/^@import[^\n]*\n/gm, "")
  }, [css])

  // setTheme is recreated on every settings change, so only call it when the
  // theme actually differs, or the two would keep re-triggering each other.
  const target = css ? custom.name : base
  React.useEffect(() => {
    if (theme !== target) setTheme(target)
  }, [theme, target, setTheme])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked: the command stays selectable in the field.
    }
  }

  return (
    <>
      <SettingsBar
        customized={customized}
        open={open}
        onOpenChange={onOpenChange}
        mode={resolvedMode}
        onModeChange={setMode}
      />
      <CustomizeSidebar
        open={open}
        onOpenChange={onOpenChange}
        mode={resolvedMode}
        custom={custom}
        setCustom={setCustom}
        defaults={defaults}
        customized={customized}
        error={error}
        css={css}
        command={command}
        copied={copied}
        onCopy={copy}
        onReset={reset}
        configJson={JSON.stringify(config, null, 2) + "\n"}
      />
    </>
  )
}
