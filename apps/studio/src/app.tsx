import * as React from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@amit-kap/glaze/components/resizable"
import { Panel } from "./panel"
import { Rail, type Tool } from "./rail"
import { Stage } from "./stage"
import { TopBar } from "./top-bar"
import { useThemeDraft } from "./draft"
import { changed, tokens, type Mode } from "./theme"

const storageKey = "glaze-studio-theme"

export function App() {
  const draft = useThemeDraft()
  const [tool, setTool] = React.useState<Tool>("colors")
  const [mode, setMode] = React.useState<Mode>("light")
  const [name, setName] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const save = React.useCallback(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ name, theme: draft.theme })
    )
    setSaved(true)
  }, [name, draft.theme])

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

  React.useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(timer)
  }, [saved])

  const exportCss = async () => {
    const block = (mode: Mode) =>
      tokens
        .filter((token) => changed(mode, token, draft.theme[mode][token]))
        .map((token) => `  --${token}: ${draft.theme[mode][token]};`)
        .join("\n")

    const light = block("light")
    const dark = block("dark")
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
    // Dark mode applies to the stage preview only; the studio stays light.
    <div className="flex h-full flex-col bg-background text-foreground">
      <TopBar
        name={name}
        onNameChange={(value) => {
          setName(value)
          setSaved(false)
        }}
        changes={draft.changes}
        onResetAll={draft.resetAll}
        saved={saved}
        copied={copied}
        onSave={save}
        onExport={exportCss}
      />

      <div className="flex min-h-0 flex-1 px-4 pb-4">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 overflow-hidden rounded-lg border bg-background"
        >
          {/* The panel keeps its shipped width as the floor, and may grow to
              half the editor — the stage always keeps the other half. */}
          <ResizablePanel
            defaultSize={436}
            minSize={436}
            maxSize="50%"
            className="min-h-0"
          >
            <div className="flex h-full min-h-0 gap-3 bg-sidebar p-2">
              <Rail value={tool} onChange={setTool} />
              <div className="w-px shrink-0 self-stretch bg-border" />
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <Panel
                  tool={tool}
                  draft={draft}
                  mode={mode}
                  onModeChange={setMode}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="w-px cursor-col-resize bg-border after:w-2 [&>div]:h-8 [&>div]:w-1 [&>div]:bg-foreground/20 [&>div]:transition-colors hover:[&>div]:bg-foreground/40"
          />

          <ResizablePanel minSize={360} className="flex min-h-0 flex-col">
            <Stage mode={mode} theme={draft.theme} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
