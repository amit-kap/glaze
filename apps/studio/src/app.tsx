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
import { toneComponentVars } from "./dials"
import { SimplePanel } from "./simple-panel"
import { TopBar } from "./top-bar"

type Level = "simple" | "advanced"
import { fresh, useThemeDraft } from "./draft"
import {
  countDiff,
  readSession,
  useLibrary,
  writeSession,
  type SavedTheme,
} from "./library"
import {
  fontCssUrl,
  googleFamilyOf,
  useFontLink,
  wantedWeights,
} from "./google-fonts"
import { changed, followVars, tokens, type Mode } from "./theme"
import { motionChanged, motionTokens } from "./motion"
import { shapeChanged, shapeTokens, type Density } from "./shape"
import { typeChanged, typeTokens } from "./typography"

export function App() {
  const draft = useThemeDraft()
  // A Google body font is linked in so the preview can draw it.
  useFontLink(googleFamilyOf(draft.type["typeface-sans"]), draft.dials.weights)
  // Simple is the front door; Advanced drills down from it and Back returns.
  const [level, setLevel] = React.useState<Level>("simple")
  const [tool, setTool] = React.useState<Tool>("colors")
  const [mode, setMode] = React.useState<Mode>("light")
  const [density, setDensity] = React.useState<Density>("comfortable")
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const [session, setSession] = React.useState(readSession)
  const { id: savedId, name } = session
  const setName = (value: string) =>
    setSession((current) => ({ ...current, name: value }))
  const [saved, setSaved] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const library = useLibrary()

  React.useEffect(() => writeSession(session), [session])

  // Edits count from the open theme's saved version, or from Nova before the
  // first save: saving means the user keeps this look, so nothing is left to undo.
  const baseline = library.themes.find((theme) => theme.id === savedId)?.data
  const base = baseline ?? fresh()
  const changes = countDiff(draft.stored, base)

  /** Save under the open theme's id, or as a new entry the first time. */
  const save = React.useCallback(() => {
    const entry = library.save(savedId, name, draft.stored)
    setSession({ id: entry.id, name: entry.name })
    setSaved(true)
  }, [library, savedId, name, draft.stored])

  const open = (theme: SavedTheme) => {
    draft.load(theme.data)
    setSession({ id: theme.id, name: theme.name })
  }

  /** Keep the open theme, then add a fresh Nova one to switch to. */
  const create = () => {
    if (savedId) library.save(savedId, name, draft.stored)
    const base = fresh()
    const entry = library.save(null, "Untitled theme", base)
    draft.load(base)
    setSession({ id: entry.id, name: entry.name })
  }

  const remove = (id: string) => {
    library.remove(id)
    // The open theme lives on as an unsaved draft; its next Save is a new entry.
    if (id === savedId) setSession((current) => ({ ...current, id: null }))
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

    const dialBlock = Object.entries(toneComponentVars(draft.dials.tone))
      .map(([token, value]) => `  ${token}: ${value};`)
      .join("\n")

    const light = [
      block("light"),
      typeBlock,
      shapeBlock,
      motionBlock,
      dialBlock,
    ]
      .filter(Boolean)
      .join("\n")
    const dark = block("dark")
    // A Google font needs its stylesheet wherever the theme is used, so the
    // export links it; @import comes before any rule.
    const fontImports = [
      ...new Set(
        ["typeface-sans", "typeface-heading"].flatMap((token) => {
          const family = googleFamilyOf(draft.type[token])
          return family && typeChanged(token, draft.type[token])
            ? [
                `@import url("${fontCssUrl(family, draft.dials.weights ?? wantedWeights)}");`,
              ]
            : []
        })
      ),
    ]

    const css = [
      `/* ${name || "Untitled theme"} — Glaze theme, based on Nova */`,
      ...fontImports,
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
        changes={changes}
        onResetAll={() => draft.load(base)}
        saved={saved}
        copied={copied}
        onSave={save}
        onExport={exportCss}
        library={library.themes}
        activeId={savedId}
        onOpen={open}
        onCreate={create}
        onDelete={remove}
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
                <SimplePanel draft={draft} mode={mode} />
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
              onModeChange={setMode}
              theme={draft.theme}
              type={draft.type}
              shape={draft.shape}
              density={density}
              motion={draft.motion}
              extraVars={toneComponentVars(draft.dials.tone)}
              reduceMotion={reduceMotion}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
