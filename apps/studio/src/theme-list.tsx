import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"
import { cn } from "@amit-kap/glaze/lib/utils"

import {
  EntryContextMenu,
  EntryMenu,
  fontNames,
  ThemeTile,
  type Entry,
} from "./theme-card"

/** The list view: one row per theme. A row opens it, as the card does. */
export function ThemeTable({ entries }: { entries: Entry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {/* Narrow screens keep the name, the date and the menu. */}
          <TableHead className="hidden @xl:table-cell">Fonts</TableHead>
          <TableHead>Saved</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <EntryContextMenu key={entry.key} entry={entry}>
            <TableRow
              // The click is for the mouse; the name button is the keyboard's
              // way in, and its click bubbles up here.
              onClick={entry.onOpen}
              className={cn(entry.onOpen && "cursor-pointer")}
              data-testid={entry.onOpen ? undefined : entry.testId}
            >
              <TableCell>
                {entry.onOpen ? (
                  <button
                    type="button"
                    aria-label={entry.name}
                    data-testid={entry.testId}
                    data-template={entry.template}
                    className="flex items-center gap-3 rounded-control text-start text-body font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ThemeTile stored={entry.stored} />
                    {entry.name}
                  </button>
                ) : (
                  <span className="flex items-center gap-3 text-body font-medium">
                    <ThemeTile stored={entry.stored} />
                    {entry.name}
                  </span>
                )}
              </TableCell>
              <TableCell className="hidden text-muted-foreground @xl:table-cell">
                {fontNames(entry.stored)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.saved}
              </TableCell>
              <TableCell
                className="text-end"
                // The menu's clicks must not also open the row.
                onClick={(event) => event.stopPropagation()}
              >
                <EntryMenu entry={entry} />
              </TableCell>
            </TableRow>
          </EntryContextMenu>
        ))}
      </TableBody>
    </Table>
  )
}
