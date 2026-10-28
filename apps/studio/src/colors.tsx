import * as React from "react"

import { ColorSelector } from "@amit-kap/glaze/components/color-selector"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import type { ColorFormat } from "@amit-kap/glaze/lib/color"

import type { Draft } from "./draft"
import { PanelSection } from "./section"
import {
  groups,
  rowOf,
  type Color,
  type Group,
  type Mode,
  type Theme,
} from "./theme"

// The colour that does the reading, and the fill it sits on. A badge is only
// shown for pairs that actually meet in the interface.
const pairs: Record<string, [fg: string, bg: string]> = {
  brand: ["brand-ink", "brand"],
  "brand-ink": ["brand-ink", "brand"],
  primary: ["primary-foreground", "primary"],
  "primary-foreground": ["primary-foreground", "primary"],
  background: ["foreground", "background"],
  card: ["foreground", "card"],
  foreground: ["foreground", "background"],
  "muted-foreground": ["muted-foreground", "background"],
}

const formats: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
]

const modes: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

/**
 * The Colors tool: one card per colour, grouped by what the colours are for.
 * Each card opens in place, so the picker and the tokens it feeds are always
 * seen together with the value being edited.
 */
export function Colors({
  draft,
  mode,
  onModeChange,
}: {
  draft: Draft
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  const { theme, overridden, setColor, resetColor } = draft
  // One notation for the whole tool: every readout and every picker follows it.
  const [format, setFormat] = React.useState<ColorFormat>("oklch")
  // Everything starts closed: the panel is a list of colours first, and one
  // opens only when it's the colour being edited.
  const [open, setOpen] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 bg-sidebar">
        <h2 className="text-title font-medium text-foreground">Colors</h2>
        <div className="flex items-center gap-2">
          <Select
            items={formats}
            value={format}
            onValueChange={(value) => value && setFormat(value as ColorFormat)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Colour format"
              className="bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {formats.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={modes}
            value={mode}
            onValueChange={(value) => value && onModeChange(value as Mode)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Mode being edited"
              className="bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {modes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {groups.map((group, index) => (
        <GroupSection
          key={group.id}
          group={group}
          defaultOpen={index === 0}
          mode={mode}
          theme={theme}
          open={open}
          setOpen={setOpen}
          format={format}
          onFormatChange={setFormat}
          overridden={overridden}
          setColor={setColor}
          resetColor={resetColor}
        />
      ))}
    </div>
  )
}

function GroupSection({
  group,
  defaultOpen,
  format,
  onFormatChange,
  mode,
  theme,
  open,
  setOpen,
  overridden,
  setColor,
  resetColor,
}: {
  group: Group
  /** Only the first group opens on load. */
  defaultOpen: boolean
  format: ColorFormat
  onFormatChange: (format: ColorFormat) => void
  mode: Mode
  theme: Theme
  open: string | null
  setOpen: (token: string | null) => void
  overridden: Draft["overridden"]
  setColor: Draft["setColor"]
  resetColor: Draft["resetColor"]
}) {
  const colors = theme[mode]

  return (
    <PanelSection
      title={group.title}
      note={group.note}
      defaultOpen={defaultOpen}
    >
      {group.rows.map((row) => {
        const pair = pairs[row.token]
        return (
          <ColorSelector
            key={row.token}
            label={row.label}
            value={colors[row.token]}
            description={row.note}
            contrast={
              pair
                ? {
                    foreground: colors[pair[0]],
                    background: colors[pair[1]],
                  }
                : undefined
            }
            dependents={row.feeds.map((token) => ({
              label: rowOf[token]?.label ?? token,
              value: colors[token] ?? colors[row.token],
            }))}
            format={format}
            onFormatChange={onFormatChange}
            edited={overridden(mode, row.token)}
            onReset={() => resetColor(mode, row.token)}
            open={open === row.token}
            onOpenChange={(next) => setOpen(next ? row.token : null)}
            onValueChange={(value: Color) => setColor(mode, row.token, value)}
          />
        )
      })}
    </PanelSection>
  )
}
