import * as React from "react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@amit-kap/glaze/components/alert-dialog"
import { Button } from "@amit-kap/glaze/components/button"

import { Editor } from "./editor"
import { Home } from "./home"
import { fresh, useThemeDraft } from "./draft"
import {
  countDiff,
  readSession,
  useLibrary,
  writeSession,
  type SavedTheme,
} from "./library"
import { useRoute } from "./route"
import type { Template } from "./templates"

/**
 * Studio: Home and the editor. The draft, the open theme and the library live
 * here, above both, so they survive moving between the two.
 */
export function App() {
  const { route, go } = useRoute()
  const draft = useThemeDraft()
  const [session, setSession] = React.useState(readSession)
  const { id: savedId, name } = session
  const library = useLibrary()
  // A move that would replace unsaved work waits here for Save or Discard.
  const [pending, setPending] = React.useState<(() => void) | null>(null)

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
  }, [library, savedId, name, draft.stored])

  const open = (theme: SavedTheme) => {
    draft.load(theme.data)
    setSession({ id: theme.id, name: theme.name })
  }

  /** Keep the open theme, then add a fresh Nova one to switch to. */
  const create = () => {
    if (savedId) library.save(savedId, name, draft.stored)
    startNew()
  }

  const startNew = () => {
    const start = fresh()
    const entry = library.save(null, "Untitled theme", start)
    draft.load(start)
    setSession({ id: entry.id, name: entry.name })
  }

  const remove = (id: string) => {
    library.remove(id)
    // The open theme lives on as an unsaved draft; its next Save is a new entry.
    if (id === savedId) setSession((current) => ({ ...current, id: null }))
  }

  /** Run a move from Home; unsaved work is offered Save or Discard first. */
  const guarded = (action: () => void) => {
    if (changes === 0) return action()
    setPending(() => action)
  }

  const enter = (action: () => void) => () => {
    action()
    go("edit")
  }

  return (
    <>
      {route === "edit" ? (
        <Editor
          draft={draft}
          session={session}
          setSession={setSession}
          library={library}
          changes={changes}
          base={base}
          onSave={save}
          onOpen={open}
          onCreate={create}
          onDelete={remove}
        />
      ) : (
        <Home
          themes={library.themes}
          // A template is a copy: its first Save makes a new library entry.
          onOpenTemplate={(template: Template) =>
            guarded(
              enter(() => {
                draft.load(template.data)
                setSession({ id: null, name: template.name })
              })
            )
          }
          onOpenTheme={(theme) => guarded(enter(() => open(theme)))}
          onCreate={() => guarded(enter(startNew))}
          onDelete={remove}
        />
      )}

      <AlertDialog
        open={pending !== null}
        onOpenChange={(next) => !next && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Save changes to {name.trim() || "Untitled theme"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Opening another theme replaces the one you are editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                pending?.()
                setPending(null)
              }}
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                save()
                pending?.()
                setPending(null)
              }}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
