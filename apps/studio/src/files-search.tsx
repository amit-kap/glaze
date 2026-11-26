import * as React from "react"
import { SearchIcon } from "lucide-react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@amit-kap/glaze/components/combobox"
import { InputGroupAddon } from "@amit-kap/glaze/components/input-group"
import { Kbd } from "@amit-kap/glaze/components/kbd"

import { ThemeTile, type Entry } from "./theme-card"

export type SearchGroup = { label: string; items: Entry[] }

/**
 * Search, in the side panel: a field whose list opens under it with the
 * user's recent themes and the templates, and narrows as they type. Picking
 * one opens it. ⌘K puts the cursor in the field.
 */
export function FilesSearch({
  groups,
  onPick,
}: {
  groups: SearchGroup[]
  /** Called before the pick opens, so a phone's side panel can close first. */
  onPick?: () => void
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <Combobox<Entry>
      items={groups}
      // Nothing stays chosen: a pick opens the theme and clears the field.
      value={null}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={(entry) => entry.name}
      onValueChange={(entry) => {
        if (!entry) return
        setQuery("")
        input.current?.blur()
        onPick?.()
        entry.onOpen?.()
      }}
    >
      <ComboboxInput
        ref={input}
        data-testid="search"
        aria-label="Search"
        placeholder="Search"
        showTrigger={false}
        className="w-full"
      >
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="pe-0">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </ComboboxInput>
      {/* Wider than the field, so a name and its date fit on one row. */}
      <ComboboxContent className="w-80" data-testid="search-results">
        <ComboboxEmpty>No results</ComboboxEmpty>
        <ComboboxList>
          {(group: SearchGroup) => (
            <ComboboxGroup key={group.label} items={group.items}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              <ComboboxCollection>
                {(entry: Entry) => (
                  <ComboboxItem
                    key={entry.key}
                    value={entry}
                    className="gap-3 py-1.5 pe-2"
                  >
                    <ThemeTile stored={entry.stored} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{entry.name}</span>
                      <span className="truncate text-caption text-muted-foreground">
                        {entry.template ? entry.saved : `Saved ${entry.saved}`}
                      </span>
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
