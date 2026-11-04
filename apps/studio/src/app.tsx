import * as React from "react"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@amit-kap/glaze/components/resizable"
import { Panel } from "./panel"
import { Rail, type Tool } from "./rail"
import { Stage } from "./stage"
import { dialMotionTokens, dialTokens, toneTypeTokens } from "./dials"
import { SimplePanel } from "./simple-panel"
import { TopBar } from "./top-bar"

type Level = "simple" | "advanced"
import { useThemeDraft, type Stored } from "./draft"
import { changed, followVars, tokens, type Mode } from "./theme"
import { motionChanged, motionTokens } from "./motion"
import { shapeChanged, shapeTokens, type Density } from "./shape"
import { typeChanged, typeTokens } from "./typography"

const storageKey = "glaze-studio-theme"
const presetsKey = "glaze-studio-presets"

type Preset = { name: string; draft: Stored; density: Density }

function readPresets(): Preset[] {
  try {
    const stored = JSON.parse(localStorage.getItem(presetsKey) ?? "[]")
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function App() {
  const draft = useThemeDraft()
  // Simple is the front door; Advanced drills down from it and Back returns.
  const [level, setLevel] = React.useState<Level>("simple")
  const [tool, setTool] = React.useState<Tool>("colors")
  const [mode, setMode] = React.useState<Mode>("light")
  const [density, setDensity] = React.useState<Density>("comfortable")
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const [name, setName] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [presets, setPresets] = React.useState(readPresets)
  const [preset, setPreset] = React.useState("base")

  // What the Simple controls cover directly, so Simple can say what it isn't
  // showing: brand in either mode and the sans typeface.
  const simpleChanges =
    Number(draft.overridden("light", "brand")) +
    Number(draft.overridden("dark", "brand")) +
    Number(typeChanged("typeface-sans", draft.type["typeface-sans"]))
  // Colours and type a dial generates are one change, not one per token.
  const dialled =
    (["light", "dark"] as const).reduce(
      (n, mode) =>
        n +
        dialTokens.filter(
          (token) =>
            !draft.unlinked[mode].includes(token) &&
            draft.overridden(mode, token)
        ).length,
      0
    ) +
    (draft.dials.tone === 0
      ? 0
      : toneTypeTokens.filter((token) =>
          typeChanged(token, draft.type[token])
        ).length) +
    (draft.dials.motion === "none"
      ? 0
      : dialMotionTokens.filter((token) =>
          motionChanged(token, draft.motion[token])
        ).length)
  const advancedChanges = Math.max(0, draft.changes - simpleChanges - dialled)

  const save = React.useCallback(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ name, theme: draft.theme })
    )
    // A named save also keeps the whole draft as a preset to open again.
    if (name.trim()) {
      const next = [
        ...presets.filter((item) => item.name !== name.trim()),
        { name: name.trim(), draft: draft.snapshot, density },
      ]
      localStorage.setItem(presetsKey, JSON.stringify(next))
      setPresets(next)
      setPreset(name.trim())
    }
    setSaved(true)
  }, [name, draft.theme, draft.snapshot, density, presets])

  const choosePreset = (value: string) => {
    setPreset(value)
    const found = presets.find((item) => item.name === value)
    if (found) {
      draft.load(found.draft)
      setDensity(found.density)
      setName(found.name)
    } else {
      draft.resetAll()
      setDensity("comfortable")
    }
  }

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
    // A changed colour also carries the derived colours Nova writes as
    // literals, so the exported theme follows it as the preview does.
    const block = (mode: Mode) => {
      const edited = tokens.filter((token) =>
        changed(mode, token, draft.theme[mode][token])
      )
      return [
        ...edited.map((token) => `  --${token}: ${draft.theme[mode][token]};`),
        ...followVars(edited).map(([token, value]) => `  ${token}: ${value};`),
      ].join("\n")
    }

    // Type, shape and motion are shared by both modes, so they export with the
    // light block.
    const typeBlock = typeTokens
      .filter((token) => typeChanged(token, draft.type[token]))
      .map((token) => `  --${token}: ${draft.type[token]};`)
      .join("\n")
    const shapeBlock = shapeTokens
      .filter((token) => shapeChanged(token, draft.shape[token]))
      .map((token) => `  --${token}: ${draft.shape[token]};`)
      .join("\n")

    const motionBlock = motionTokens
      .filter((token) => motionChanged(token, draft.motion[token]))
      .map((token) => `  --${token}: ${draft.motion[token]};`)
      .join("\n")

    const light = [block("light"), typeBlock, shapeBlock, motionBlock]
      .filter(Boolean)
      .join("\n")
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
        mode={mode}
        onModeChange={setMode}
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
            {level === "simple" ? (
              <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-sidebar p-2 px-4">
                <SimplePanel
                  draft={draft}
                  mode={mode}
                  density={density}
                  onDensityChange={setDensity}
                  presets={[
                    { label: "Base", value: "base" },
                    ...presets.map((item) => ({
                      label: item.name,
                      value: item.name,
                    })),
                  ]}
                  preset={preset}
                  onPresetChange={choosePreset}
                  advancedChanges={advancedChanges}
                  onAdvanced={() => setLevel("advanced")}
                />
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col bg-sidebar">
                <div className="flex h-12 shrink-0 items-center px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLevel("simple")}
                  >
                    <ChevronLeftIcon />
                    Back
                  </Button>
                </div>
                <div className="flex min-h-0 flex-1 gap-3 p-2 pt-0">
                  <Rail value={tool} onChange={setTool} />
                  <div className="w-px shrink-0 self-stretch bg-border" />
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <Panel
                      tool={tool}
                      draft={draft}
                      mode={mode}
                      onModeChange={setMode}
                      density={density}
                      onDensityChange={setDensity}
                      reduceMotion={reduceMotion}
                      onReduceMotionChange={setReduceMotion}
                    />
                  </div>
                </div>
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="w-px cursor-col-resize bg-border after:w-2 [&>div]:h-8 [&>div]:w-1 [&>div]:bg-foreground/20 [&>div]:transition-colors hover:[&>div]:bg-foreground/40"
          />

          <ResizablePanel minSize={360} className="flex min-h-0 flex-col">
            <Stage
              mode={mode}
              theme={draft.theme}
              type={draft.type}
              shape={draft.shape}
              density={density}
              motion={draft.motion}
              reduceMotion={reduceMotion}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
