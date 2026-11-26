import * as React from "react"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ExternalLinkIcon,
  LayoutGridIcon,
  LayoutTemplateIcon,
  ListIcon,
  PaletteIcon,
  PlusIcon,
  Trash2Icon,
  type LucideIcon,
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
} from "@amit-kap/glaze/components/alert-dialog"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { SidebarTrigger } from "@amit-kap/glaze/components/sidebar"
import { toast } from "@amit-kap/glaze/components/toast"

import type { SearchGroup } from "./files-search"
import { FilesShell, type Page } from "./files-shell"
import { age, useArchivedTemplates, type SavedTheme } from "./library"
import { hrefFor } from "./route"
import { SignInPoster } from "./sign-in-poster"
import { templates, type Template } from "./templates"
import { ThemeCard, type Entry } from "./theme-card"
import { ThemeTable } from "./theme-list"
import { useUser } from "./user"
import { useView, type View } from "./view"

const titles: Record<Page, string> = {
  home: "Recents",
  templates: "Templates",
  archive: "Archive",
}

// Columns follow the width left beside the side panel, not the window's.
const grid =
  "grid grid-cols-1 gap-5 @xl:grid-cols-2 @4xl:grid-cols-3 @7xl:grid-cols-4"

/** A view as an icon, named for the pointer and for assistive tech. */
function ViewIcon({
  name,
  icon: Icon,
  testId,
}: {
  name: string
  icon: LucideIcon
  testId: string
}) {
  return (
    <span title={name} data-testid={testId} className="inline-flex">
      <Icon />
      <span className="sr-only">{name}</span>
    </span>
  )
}

/** Entries as cards or as rows, by the chosen view. */
function Collection({ entries, view }: { entries: Entry[]; view: View }) {
  if (view === "list") return <ThemeTable entries={entries} />
  return (
    <div className={grid}>
      {entries.map((entry) => (
        <ThemeCard key={entry.key} entry={entry} />
      ))}
    </div>
  )
}

/** A page with nothing on it: what is missing, and the way forward. */
function Nothing({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children?: React.ReactNode
}) {
  return (
    <Empty className="border py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
      </EmptyHeader>
      {children && <EmptyContent>{children}</EmptyContent>}
    </Empty>
  )
}

/**
 * Home: the files pages. Recents holds the signed-in user's themes, Templates
 * the starting points and Archive what was put away, themes and templates
 * alike.
 */
export function Home({
  page,
  themes,
  archived,
  onOpenTemplate,
  onOpenTheme,
  onCreate,
  onArchive,
  onRestore,
  onDelete,
}: {
  page: Page
  themes: SavedTheme[]
  archived: SavedTheme[]
  onOpenTemplate: (template: Template) => void
  onOpenTheme: (theme: SavedTheme) => void
  onCreate: () => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { user } = useUser()
  const [view, setView] = useView()
  const hidden = useArchivedTemplates()
  const [deleting, setDeleting] = React.useState<SavedTheme | null>(null)

  /** Put something away, and offer the way back while it is fresh. */
  const archive = (name: string, put: () => void, undo: () => void) => {
    put()
    const id = toast.add({
      title: `Archived ${name}`,
      actionProps: {
        children: "Undo",
        onClick: () => {
          undo()
          toast.close(id)
        },
      },
    })
  }

  const restore = (name: string, undo: () => void) => {
    undo()
    toast.add({ title: `Restored ${name}` })
  }

  const templateEntries: Entry[] = templates
    .filter((template) => !(template.name in hidden.archived))
    .map((template) => ({
      key: template.name,
      name: template.name,
      stored: template.data,
      saved: "Template",
      testId: "template-card",
      template: template.name,
      onOpen: () => onOpenTemplate(template),
      actions: [
        {
          label: "Open",
          icon: ExternalLinkIcon,
          run: () => onOpenTemplate(template),
        },
        {
          label: "Archive",
          icon: ArchiveIcon,
          run: () =>
            archive(
              template.name,
              () => hidden.archive(template.name),
              () => hidden.restore(template.name)
            ),
        },
      ],
    }))

  const themeEntries: Entry[] = themes.map((theme) => ({
    key: theme.id,
    name: theme.name,
    stored: theme.data,
    saved: age(theme.savedAt),
    testId: "theme-card",
    onOpen: () => onOpenTheme(theme),
    actions: [
      { label: "Open", icon: ExternalLinkIcon, run: () => onOpenTheme(theme) },
      {
        label: "Archive",
        icon: ArchiveIcon,
        run: () =>
          archive(
            theme.name,
            () => onArchive(theme.id),
            () => onRestore(theme.id)
          ),
      },
    ],
  }))

  // The archive: the user's themes, then the templates, each newest first.
  const archivedThemes: Entry[] = (user ? archived : []).map((theme) => {
    const back = {
      label: "Restore",
      icon: ArchiveRestoreIcon,
      run: () => restore(theme.name, () => onRestore(theme.id)),
    }
    return {
      key: theme.id,
      name: theme.name,
      stored: theme.data,
      saved: age(theme.savedAt),
      caption: `Archived ${age(theme.archivedAt ?? theme.savedAt)}`,
      testId: "archived-card",
      primary: back,
      actions: [
        back,
        {
          label: "Delete forever",
          icon: Trash2Icon,
          run: () => setDeleting(theme),
          destructive: true,
        },
      ],
    }
  })
  const archivedTemplates: Entry[] = templates
    .filter((template) => template.name in hidden.archived)
    .sort((a, b) => hidden.archived[b.name] - hidden.archived[a.name])
    .map((template) => {
      const back = {
        label: "Restore",
        icon: ArchiveRestoreIcon,
        run: () => restore(template.name, () => hidden.restore(template.name)),
      }
      return {
        key: template.name,
        name: template.name,
        stored: template.data,
        saved: "Template",
        caption: `Template · Archived ${age(hidden.archived[template.name])}`,
        testId: "archived-card",
        template: template.name,
        primary: back,
        // A template is part of Studio, so it can come back but not be deleted.
        actions: [back],
      }
    })
  const archivedEntries = [...archivedThemes, ...archivedTemplates]

  const search: SearchGroup[] = [
    { label: "Recents", items: user ? themeEntries : [] },
    { label: "Templates", items: templateEntries },
  ].filter((group) => group.items.length > 0)

  const fromTemplate = templateEntries.length > 0 && (
    <section aria-labelledby="home-templates" className="flex flex-col gap-5">
      <h2 id="home-templates" className="text-title font-medium">
        Start from a template
      </h2>
      <Collection entries={templateEntries} view={view} />
    </section>
  )

  let content: React.ReactNode
  if (page === "templates") {
    content =
      templateEntries.length === 0 ? (
        <Nothing icon={LayoutTemplateIcon} title="Every template is archived">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={hrefFor("archive")} />}
          >
            <ArchiveIcon />
            Open the archive
          </Button>
        </Nothing>
      ) : (
        <Collection entries={templateEntries} view={view} />
      )
  } else if (page === "archive") {
    content =
      archivedEntries.length === 0 ? (
        <Nothing icon={ArchiveIcon} title="Nothing archived" />
      ) : (
        <Collection entries={archivedEntries} view={view} />
      )
  } else if (!user) {
    content = (
      <>
        <SignInPoster saved={themes.length} />
        {fromTemplate}
      </>
    )
  } else if (themeEntries.length === 0) {
    content = (
      <>
        <Nothing icon={PaletteIcon} title="No themes yet">
          <NewThemeButton onClick={onCreate} />
        </Nothing>
        {fromTemplate}
      </>
    )
  } else {
    content = <Collection entries={themeEntries} view={view} />
  }

  return (
    <FilesShell
      page={page}
      archivedCount={archivedEntries.length}
      search={search}
    >
      <header className="flex h-15 shrink-0 items-center gap-3 px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-heading font-medium">{titles[page]}</h1>
        <div className="ms-auto flex items-center gap-3">
          {page !== "archive" && (
            <NewThemeButton onClick={onCreate} testId="new-theme" />
          )}
          <SegmentedControl
            label="View"
            className="**:data-[slot=tabs-trigger]:w-8 **:data-[slot=tabs-trigger]:flex-none **:data-[slot=tabs-trigger]:px-0"
            value={view}
            onValueChange={setView}
            options={[
              {
                value: "grid",
                label: (
                  <ViewIcon
                    name="Grid view"
                    icon={LayoutGridIcon}
                    testId="view-grid"
                  />
                ),
              },
              {
                value: "list",
                label: (
                  <ViewIcon
                    name="List view"
                    icon={ListIcon}
                    testId="view-list"
                  />
                ),
              },
            ]}
          />
        </div>
      </header>

      <div className="@container flex min-h-0 flex-1 flex-col gap-10 overflow-auto px-6 pt-4 pb-16">
        {content}
      </div>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(next) => !next && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleting?.name} forever?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) onDelete(deleting.id)
                setDeleting(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FilesShell>
  )
}

function NewThemeButton({
  onClick,
  testId,
}: {
  onClick: () => void
  testId?: string
}) {
  return (
    <Button onClick={onClick} data-testid={testId}>
      <PlusIcon />
      New theme
    </Button>
  )
}
