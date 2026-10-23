import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@amit-kap/glaze/components/alert-dialog"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"
import { Textarea } from "@amit-kap/glaze/components/textarea"

import type { StudioActions } from "../control-panel/actions"
import type { SavedTheme } from "../control-panel/custom-theme-store"
import { countChanges } from "../theme-builder"

// Coarse enough to stay true while the dialog is open.
const relativeDate = (at: number) => {
  const days = Math.floor((Date.now() - at) / 86_400_000)
  if (days <= 0) return "today"
  if (days === 1) return "yesterday"
  return `${days} days ago`
}

// Shown on each row so a saved theme is recognisable before it is loaded.
const dotKeys = ["brand", "background", "ink"] as const

// The Library dialog: saved themes, import from a file or paste, share link.
// Opens from `trigger`, which is rendered as the DialogTrigger.
export function LibraryDialog({
  actions,
  trigger,
}: {
  actions: StudioActions
  trigger: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Library</DialogTitle>
          <DialogDescription>
            Themes you saved in this browser, plus import and sharing.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="saved">
          <TabsList className="w-full">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>
          <TabsContent value="saved" className="flex flex-col gap-3 pt-2">
            <SavedTab actions={actions} />
          </TabsContent>
          <TabsContent value="import" className="flex flex-col gap-3 pt-2">
            <ImportTab actions={actions} onDone={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="share" className="flex flex-col gap-3 pt-2">
            <ShareTab shareUrl={actions.shareUrl} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// --- Saved -----------------------------------------------------------------

function SavedTab({ actions }: { actions: StudioActions }) {
  const { library, savedId, changeCount } = actions
  const sorted = React.useMemo(
    () => [...library].sort((a, b) => b.savedAt - a.savedAt),
    [library]
  )
  return (
    <>
      <div className="flex gap-2">
        <Button
          disabled={changeCount === 0 && !savedId}
          onClick={() => actions.saveToLibrary()}
        >
          {savedId ? "Update" : "Save"}
        </Button>
        {savedId && (
          <Button variant="outline" onClick={() => actions.saveToLibrary(true)}>
            Save as new
          </Button>
        )}
      </div>
      {sorted.length === 0 ? (
        <Empty className="py-8">
          <EmptyHeader>
            <EmptyTitle>No saved themes</EmptyTitle>
            <EmptyDescription>
              Save the current theme to find it here later.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup className="max-h-80 gap-1 overflow-y-auto">
          {sorted.map((entry) => (
            <SavedRow
              key={entry.id}
              entry={entry}
              current={entry.id === savedId}
              actions={actions}
            />
          ))}
        </ItemGroup>
      )}
    </>
  )
}

function SavedRow({
  entry,
  current,
  actions,
}: {
  entry: SavedTheme
  current: boolean
  actions: StudioActions
}) {
  const { id, custom, base, savedAt } = entry
  const name = custom.name
  // null while reading, the draft text while renaming.
  const [draft, setDraft] = React.useState<string | null>(null)
  const commit = () => {
    const next = draft?.trim()
    if (next && next !== name) actions.renameInLibrary(id, next)
    setDraft(null)
  }
  const dots = dotKeys.flatMap((key) => custom.light[key] ?? [])
  return (
    <Item size="sm" variant="muted" role="listitem">
      <ItemContent>
        {draft === null ? (
          <ItemTitle>
            {dots.length > 0 && (
              <span aria-hidden="true" className="flex gap-1">
                {dots.map((color, i) => (
                  <span
                    key={i}
                    className="size-3 rounded-pill border border-border/60"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            )}
            <span className="truncate">{name}</span>
            {current && <Badge variant="secondary">Current</Badge>}
          </ItemTitle>
        ) : (
          <Input
            size="sm"
            autoFocus
            aria-label="Theme name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit()
              // Blur would commit; clear the draft before it fires.
              if (e.key === "Escape") setDraft(null)
            }}
          />
        )}
        <ItemDescription className="text-caption">
          Based on {base} · {countChanges(custom)} changes ·{" "}
          {relativeDate(savedAt)}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.loadFromLibrary(id)}
        >
          Load
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Rename ${name}`}
          onClick={() => setDraft(name)}
        >
          <PencilIcon />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${name}`}
              />
            }
          >
            <Trash2Icon />
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes it from the library in this browser. The current
                draft is not affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => actions.deleteFromLibrary(id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  )
}

// --- Import ----------------------------------------------------------------

function ImportTab({
  actions,
  onDone,
}: {
  actions: StudioActions
  onDone: () => void
}) {
  const [text, setText] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [imported, setImported] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const readFile = async (file: File | undefined) => {
    if (!file) return
    setText(await file.text())
    setError(null)
  }

  const submit = () => {
    const problem = actions.importConfig(text)
    setError(problem)
    if (problem) return
    setText("")
    setImported(true)
    // Long enough to read the confirmation before the dialog goes.
    setTimeout(onDone, 600)
  }

  return (
    <>
      <Textarea
        aria-label="Theme to import"
        placeholder="Paste a glaze.config.json or a generated theme .css, or drop the file here"
        spellCheck={false}
        className="min-h-40 font-mono text-caption"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError(null)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void readFile(e.dataTransfer.files[0])
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept=".json,.css"
        className="hidden"
        onChange={(e) => {
          void readFile(e.target.files?.[0])
          // So picking the same file again still fires onChange.
          e.target.value = ""
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <UploadIcon />
          Choose file…
        </Button>
        <Button disabled={!text.trim()} onClick={submit}>
          Import
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      )}
      {imported && (
        <p role="status" className="text-caption text-muted-foreground">
          Imported — the panel now shows this theme
        </p>
      )}
    </>
  )
}

// --- Share -----------------------------------------------------------------

function ShareTab({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked: the link stays selectable in the field.
    }
  }
  return (
    <>
      <InputGroup>
        <InputGroupInput
          readOnly
          aria-label="Share link"
          value={shareUrl}
          placeholder="No link yet"
          onFocus={(e) => e.target.select()}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Copy share link"
            disabled={!shareUrl}
            onClick={copy}
          >
            <span className="icon-swap" data-swapped={copied || undefined}>
              <CopyIcon />
              <CheckIcon />
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p className="text-caption text-muted-foreground">
        {shareUrl
          ? "Anyone with this link opens the showcase with this theme loaded."
          : "Change something first — the default themes don't need a link."}
      </p>
    </>
  )
}
