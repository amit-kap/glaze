import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Card, CardContent } from "@amit-kap/glaze/components/card"
import { Input } from "@amit-kap/glaze/components/input"
import { cn } from "@amit-kap/glaze/lib/utils"

import type { Draft } from "./draft"
import {
  fontStack,
  googleFamilyOf,
  useGoogleFonts,
  usableWeights,
} from "./google-fonts"
import { fontOptions } from "./typography"

// The faces that ship with Studio: instant and offline.
const bundled = [
  ...fontOptions["typeface-sans"].filter(
    (font) => font.label !== "Playfair Display"
  ),
  { label: "JetBrains Mono", value: '"JetBrains Mono Variable", monospace' },
]

// Google rows drawn at once; scrolling to the end draws this many more, so the
// whole catalog can be browsed without drawing two thousand rows up front.
const chunk = 50

function Row({
  label,
  note,
  selected,
  fontFamily,
  onSelect,
}: {
  label: string
  note?: string
  selected: boolean
  fontFamily?: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      style={fontFamily ? { fontFamily } : undefined}
      className={cn(
        "flex h-control-sm shrink-0 items-center justify-between gap-2 rounded-item px-2.5 text-body text-foreground outline-none hover:bg-muted focus-visible:bg-muted",
        selected && "bg-muted"
      )}
    >
      <span className="truncate">{label}</span>
      <span className="flex items-center gap-2">
        {note && (
          <span className="font-sans text-caption text-muted-foreground">
            {note}
          </span>
        )}
        {selected && <CheckIcon className="size-4" />}
      </span>
    </button>
  )
}

export type FontSource = "glaze" | "google"

/**
 * The body font, from one of two sources the caller toggles between: the
 * faces bundled with Glaze, or Google's catalog with a search. The card keeps
 * its height either way, so switching doesn't move the panel.
 */
export function TypefacePicker({
  draft,
  source,
}: {
  draft: Draft
  source: FontSource
}) {
  const [query, setQuery] = React.useState("")
  const [shown, setShown] = React.useState(chunk)
  const google = useGoogleFonts(source === "google")
  const current = draft.type["typeface-sans"]
  const currentGoogle = googleFamilyOf(current)

  const needle = query.trim().toLowerCase()
  const matches = google.fonts.filter(
    (font) => !needle || font.family.toLowerCase().includes(needle)
  )

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        {/* The top slot is the same height in both sources. */}
        {source === "google" ? (
          <Input
            type="search"
            size="sm"
            aria-label="Search Google Fonts"
            placeholder="Search Google Fonts"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setShown(chunk)
            }}
          />
        ) : (
          <p className="flex h-control-sm items-center px-2.5 text-caption text-muted-foreground">
            Bundled with Glaze. Works offline.
          </p>
        )}
        <div
          role="listbox"
          aria-label="Typeface"
          // Always five rows tall: five rows and the gaps between them.
          // Anything beyond that scrolls inside the card.
          className="flex h-[calc(var(--control-sm)*5+var(--spacing)*2)] flex-col gap-0.5 overflow-y-auto"
          onScroll={(event) => {
            if (source !== "google") return
            const list = event.currentTarget
            if (list.scrollTop + list.clientHeight >= list.scrollHeight - 40)
              setShown((count) => count + chunk)
          }}
        >
          {source === "glaze" &&
            bundled.map((font) => (
              <Row
                key={font.label}
                label={font.label}
                fontFamily={font.value}
                selected={current === font.value}
                onSelect={() => draft.setTypeface(font.value, null)}
              />
            ))}

          {source === "google" && (
            <>
              {/* A Google font that is chosen stays at the top, found or not. */}
              {!needle && currentGoogle && (
                <Row label={currentGoogle} selected onSelect={() => {}} />
              )}
              {matches.slice(0, shown).map((font) => (
                <Row
                  key={font.family}
                  label={font.family}
                  note={font.category}
                  selected={current === fontStack(font)}
                  onSelect={() =>
                    draft.setTypeface(
                      fontStack(font),
                      usableWeights(font.weights)
                    )
                  }
                />
              ))}
              {google.status === "loading" && (
                <p className="px-2.5 py-1 text-caption text-muted-foreground">
                  Loading Google Fonts…
                </p>
              )}
              {google.status === "error" && (
                <p className="px-2.5 py-1 text-caption text-muted-foreground">
                  Couldn&apos;t load Google Fonts. Check the connection and
                  reload.
                </p>
              )}
              {google.status === "ready" && matches.length === 0 && (
                <p className="px-2.5 py-1 text-caption text-muted-foreground">
                  No font matches.
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
