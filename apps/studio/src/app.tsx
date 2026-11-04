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
import { ExportDialog } from "./export-dialog"
import { fresh, useThemeDraft } from "./draft"
import { readThemeFile } from "./theme-file"
import {
  countDiff,
  readSession,
  useLibrary,
  writeSession,
  type SavedTheme,
} from "./library"
import { googleFamilyOf, useFontLink } from "./google-fonts"
import { type Mode } from "./theme"
import { type Density } from "./shape"

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
  const [exporting, setExporting] = React.useState(false)
  const [importError, setImportError] = React.useState<string | null>(null)
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

  /** Add a theme file to the library and open it. */
  const importFile = async (file: File) => {
    const result = readThemeFile(await file.text())
    if ("error" in result) return setImportError(result.error)
    setImportError(null)
    const entry = library.save(null, result.name, result.data)
    draft.load(result.data)
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
        onSave={save}
        onExport={() => setExporting(true)}
        onImport={importFile}
        importError={importError}
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
              <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-sidebar p-[13px] pt-5">
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

          <ResizableHandle className="cursor-col-resize transition-colors duration-(--duration-fast) after:w-2 hover:bg-foreground/40 data-[separator=active]:bg-foreground/60" />

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
      <ExportDialog
        open={exporting}
        onOpenChange={setExporting}
        name={name}
        stored={draft.stored}
      />
    </div>
  )
}
