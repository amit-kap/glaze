import * as React from "react"

import { parseConfig } from "@amit-kap/glaze/lib/config"
import { readEmbeddedConfig } from "@amit-kap/glaze/lib/generate"
import { useTheme } from "@amit-kap/glaze/theme"

import { CustomizeSidebar } from "../customize-sidebar"
import { SettingsBar } from "./settings-bar"
import type { StudioActions } from "./actions"
import {
  loadCustomTheme,
  loadLibrary,
  newId,
  saveCustomTheme,
  saveLibrary,
  type CustomThemeState,
  type SavedTheme,
} from "./custom-theme-store"
import {
  countChanges,
  decodeShare,
  emptyCustom,
  encodeShare,
  fromConfig,
  isBaseTheme,
  themeCss,
  themeDefaults,
  toConfig,
  type BaseTheme,
  type Custom,
} from "../theme-builder"

const styleId = "glaze-showcase-custom"

// A share link's hash wins over the stored draft, once: it's cleared from
// the address bar so a reload doesn't overwrite later edits with it.
function initialState(fallback: BaseTheme): CustomThemeState {
  const shared = location.hash.startsWith("#t=")
    ? decodeShare(location.hash)
    : null
  if (shared) {
    history.replaceState(null, "", location.pathname + location.search)
    return shared
  }
  return loadCustomTheme() ?? { base: fallback, custom: emptyCustom }
}

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
  const { theme, setTheme, mode, setMode, resolvedMode, density, setDensity } =
    useTheme()
  const [copied, setCopied] = React.useState(false)
  const [state, setState] = React.useState<CustomThemeState>(() =>
    initialState(isBaseTheme(theme) ? theme : "nova")
  )
  const [library, setLibrary] = React.useState<SavedTheme[]>(loadLibrary)
  const { base, custom, savedId } = state
  const defaults = React.useMemo(() => themeDefaults(base), [base])
  const changeCount = countChanges(custom)
  const customized = changeCount > 0
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
  React.useEffect(() => saveLibrary(library), [library])

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

  // A saved copy of the draft; the id is kept on the draft so later saves
  // update the same entry.
  const saveToLibrary = (asNew = false) => {
    const id = asNew || !savedId ? newId() : savedId
    const entry: SavedTheme = { id, base, custom, savedAt: Date.now() }
    setLibrary((list) =>
      list.some((t) => t.id === id)
        ? list.map((t) => (t.id === id ? entry : t))
        : [...list, entry]
    )
    setState((s) => ({ ...s, savedId: id }))
  }

  const importConfig = (text: string): string | null => {
    try {
      const raw = text.trimStart().startsWith("{")
        ? JSON.parse(text)
        : readEmbeddedConfig(text)
      if (raw === undefined)
        return "No Glaze config found: paste a glaze.config.json or a theme CSS file generated by Glaze."
      const parsed = parseConfig(raw)
      setState({
        base: parsed.extends,
        custom: fromConfig(parsed, themeDefaults(parsed.extends)),
      })
      return null
    } catch (e) {
      return (e as Error).message.replace(/^Invalid Glaze config:\n\s*/, "")
    }
  }

  const actions: StudioActions = {
    base,
    setBase: (next) =>
      setState((s) => ({
        base: next,
        custom: { ...emptyCustom, name: s.custom.name },
      })),
    setName: (name) => setCustom((c) => ({ ...c, name })),
    reset,
    changeCount,
    library,
    savedId,
    saveToLibrary,
    loadFromLibrary: (id) => {
      const entry = library.find((t) => t.id === id)
      if (entry)
        setState({ base: entry.base, custom: entry.custom, savedId: id })
    },
    deleteFromLibrary: (id) => {
      setLibrary((list) => list.filter((t) => t.id !== id))
      if (savedId === id) setState((s) => ({ ...s, savedId: undefined }))
    },
    renameInLibrary: (id, name) =>
      setLibrary((list) =>
        list.map((t) =>
          t.id === id ? { ...t, custom: { ...t.custom, name } } : t
        )
      ),
    importConfig,
    shareUrl: customized
      ? `${location.origin}${location.pathname}#t=${encodeShare(base, custom)}`
      : "",
  }

  return (
    <>
      <SettingsBar
        customized={customized}
        open={open}
        onOpenChange={onOpenChange}
        mode={resolvedMode}
        onModeChange={setMode}
        density={density}
        onDensityChange={setDensity}
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
        actions={actions}
      />
    </>
  )
}
