import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { useTheme, type Mode } from "@amit-kap/glaze/theme"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { FieldLabel } from "@amit-kap/glaze/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

import { CustomizeSidebar } from "./customize-sidebar"
import {
  emptyCustom,
  isBaseTheme,
  isCustomized,
  themeCss,
  themeDefaults,
  toConfig,
  type BaseTheme,
  type Custom,
} from "./theme-builder"

const themes = [
  { value: "nova", label: "Nova (default)" },
  { value: "vega", label: "Vega" },
  { value: "maia", label: "Maia" },
  { value: "lyra", label: "Lyra" },
  { value: "mira", label: "Mira" },
  { value: "luma", label: "Luma" },
  { value: "sera", label: "Sera" },
  { value: "rhea", label: "Rhea" },
  { value: "gr8r", label: "Gr8r" },
]

const modes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

// lucide has no brand icons; these are the GitHub and npm marks.
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function NpmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  )
}

// Theme and Mode in the bar: the label shows from sm up.
function BarSelect({
  className,
  id,
  label,
  items,
  value,
  onChange,
}: {
  className?: string
  id: string
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <FieldLabel
        htmlFor={id}
        className="text-body text-muted-foreground max-sm:sr-only"
      >
        {label}
      </FieldLabel>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v as string)}
      >
        <SelectTrigger id={id} size="sm" className="w-36 max-sm:w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

// The custom theme is kept beside ThemeProvider's own storage, so a reload
// restores it. The key is versioned: earlier shapes are ignored.
const storageKey = "glaze-showcase-custom-v2"
const styleId = "glaze-showcase-custom"

type State = { base: BaseTheme; custom: Custom }

function load(): State | null {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null")
    if (!stored || !isBaseTheme(stored.base)) return null
    return {
      base: stored.base,
      custom: { ...emptyCustom, ...stored.custom },
    }
  } catch {
    return null
  }
}

function save(value: State) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    // Storage blocked: the custom theme lasts for this visit only.
  }
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
  const { theme, setTheme, mode, setMode, density } = useTheme()
  const [copied, setCopied] = React.useState(false)
  const [state, setState] = React.useState<State>(
    () =>
      load() ?? {
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

  React.useEffect(() => save(state), [state])

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

  const bar = (
    <div
      role="toolbar"
      aria-label="Theme settings"
      className={`fixed inset-x-3 bottom-6 z-40 mx-auto flex max-w-2xl items-center gap-1.5 rounded-container border bg-popover p-4 text-popover-foreground shadow-floating motion-reduce:transition-none sm:gap-4 lg:transition-[right] lg:duration-(--duration-moderate) lg:ease-standard ${open ? "lg:inset-e-[calc(--spacing(80)+--spacing(3))]" : ""}`}
    >
      <span className="flex items-center gap-0.5">
        <span className="me-1.5 font-heading text-title font-medium max-sm:me-0.5 max-sm:text-body">
          Glaze
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Glaze on npm"
          className="max-sm:hidden"
          nativeButton={false}
          render={<a href="https://www.npmjs.com/package/@amit-kap/glaze" />}
        >
          <NpmIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Glaze on GitHub"
          className="max-sm:hidden"
          nativeButton={false}
          render={<a href="https://github.com/amit-kap/glaze" />}
        >
          <GitHubIcon />
        </Button>
      </span>
      <BarSelect
        className="max-sm:flex-3"
        id="panel-theme"
        label="Theme"
        items={themes}
        value={base}
        onChange={(v) =>
          // A new theme starts the Customize section from its values.
          isBaseTheme(v) &&
          setState((s) => ({
            base: v,
            custom: { ...emptyCustom, name: s.custom.name },
          }))
        }
      />
      <BarSelect
        className="max-sm:flex-2"
        id="panel-mode"
        label="Mode"
        items={modes}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      <Button
        variant="outline"
        size="sm"
        className="ms-auto"
        aria-expanded={open}
        aria-controls="customize-sidebar"
        onClick={() => onOpenChange(!open)}
      >
        <SlidersHorizontalIcon />
        <span className="max-sm:sr-only">Customize</span>
        {customized && <Badge variant="secondary">Custom</Badge>}
      </Button>
    </div>
  )

  return (
    <>
      {bar}
      <CustomizeSidebar
        open={open}
        onOpenChange={onOpenChange}
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
