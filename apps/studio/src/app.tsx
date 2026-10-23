import * as React from "react"

import { Panel } from "./panel"
import { Rail, type Tool } from "./rail"
import { Stage } from "./stage"
import { TopBar } from "./top-bar"
import {
  countChanges,
  cssColor,
  defaults,
  tokens,
  type Color,
  type Mode,
  type Token,
} from "./theme"

const storageKey = "glaze-studio-theme"

export function App() {
  const [tool, setTool] = React.useState<Tool>("colors")
  const [mode, setMode] = React.useState<Mode>("light")
  const [name, setName] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Nothing edits the theme yet, so the stage previews Nova as shipped.
  const theme = defaults
  const changes = countChanges(theme.light, theme.dark)

  const save = React.useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify({ name, theme }))
    setSaved(true)
  }, [name, theme])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return
      if (event.key.toLowerCase() !== "s") return
      event.preventDefault()
      save()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [save])

  const exportCss = async () => {
    const block = (colors: Record<Token, Color>) => {
      const base = defaults[mode]
      return tokens
        .filter(({ token }) => {
          const a = colors[token]
          const b = base[token]
          return a.l !== b.l || a.c !== b.c || a.h !== b.h || a.a !== b.a
        })
        .map(({ token }) => `  --${token}: ${cssColor(colors[token])};`)
        .join("\n")
    }
    const light = block(theme.light)
    const dark = block(theme.dark)
    const css = [
      `/* ${name || "Untitled theme"} — Glaze theme, based on Nova */`,
      light && `:root {\n${light}\n}`,
      dark && `.dark {\n${dark}\n}`,
    ]
      .filter(Boolean)
      .join("\n\n")

    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* Clipboard needs a secure context; the app still works without it. */
    }
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <TopBar
        name={name}
        onNameChange={(value) => {
          setName(value)
          setSaved(false)
        }}
        changes={changes}
        saved={saved}
        copied={copied}
        onSave={save}
        onExport={exportCss}
      />

      <div className="flex min-h-0 flex-1 px-4 pb-4">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border bg-background">
          <div className="flex w-[400px] shrink-0 gap-2 border-r bg-sidebar p-2">
            <Rail value={tool} onChange={setTool} />
            <div className="w-px shrink-0 self-stretch bg-border" />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Panel tool={tool} />
            </div>
          </div>

          <Stage mode={mode} onModeChange={setMode} theme={theme} />
        </div>
      </div>
    </div>
  )
}
