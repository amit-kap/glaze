import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { Input } from "@amit-kap/glaze/components/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

import type { Draft } from "./draft"
import { PanelSection } from "./section"
import {
  fontOptions,
  toCss,
  toNumber,
  typeChanged,
  typeGroups,
  weightOptions,
  type TypeRow,
} from "./typography"

/**
 * The Type tool: fonts, text sizes with their line spacing, and weights.
 * Type is shared by light and dark, so there is no mode switch here.
 */
export function Type({ draft }: { draft: Draft }) {
  const { type, setType, resetType } = draft

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center bg-sidebar">
        <h2 className="text-title font-medium text-foreground">Type</h2>
      </div>

      {typeGroups.map((group, index) => (
        <PanelSection
          key={group.id}
          title={group.title}
          note={group.note}
          defaultOpen={index === 0}
        >
          {group.id === "typography.size-line-spacing" ? (
            <SizeRows rows={group.rows} draft={draft} />
          ) : (
            group.rows.map((row) => (
              <TypeItem
                key={row.token}
                label={row.label}
                note={row.note}
                edited={typeChanged(row.token, type[row.token])}
                onReset={() => resetType([row.token])}
              >
                {row.kind === "font" ? (
                  <ChoiceSelect
                    label={row.label}
                    items={fontOptions[row.token]}
                    value={type[row.token]}
                    onChange={(value) => setType(row.token, value)}
                  />
                ) : (
                  <SegmentedControl
                    size="mini"
                    label={row.label}
                    options={weightOptions}
                    value={String(toNumber(row.token, type[row.token]))}
                    onValueChange={(value) => setType(row.token, value)}
                  />
                )}
              </TypeItem>
            ))
          )}
        </PanelSection>
      ))}
    </div>
  )
}

/** One card per text size: its size in px beside its line-height multiplier. */
function SizeRows({ rows, draft }: { rows: TypeRow[]; draft: Draft }) {
  const { type, setType, resetType } = draft
  const sizes = rows.filter((row) => row.kind === "text")

  return sizes.map((row) => {
    const leading = `${row.token}-leading`
    const edited =
      typeChanged(row.token, type[row.token]) ||
      typeChanged(leading, type[leading])

    return (
      <TypeItem
        key={row.token}
        label={row.label}
        note={row.note}
        edited={edited}
        onReset={() => resetType([row.token, leading])}
      >
        <div className="flex items-center gap-2">
          <NumberField
            label={`${row.label} size in px`}
            hint="Text size in pixels"
            value={toNumber(row.token, type[row.token])}
            min={8}
            max={96}
            step={1}
            onCommit={(value) => setType(row.token, toCss(row.token, value))}
          />
          <NumberField
            label={`${row.label} line height`}
            hint="Line height, as a multiple of the text size"
            value={toNumber(leading, type[leading])}
            min={0.8}
            max={3}
            step={0.05}
            onCommit={(value) => setType(leading, toCss(leading, value))}
          />
        </div>
      </TypeItem>
    )
  })
}

/** One setting: its label, a reset once edited, and the control, no card. */
function TypeItem({
  label,
  note,
  edited,
  onReset,
  children,
}: {
  label: string
  note: string
  edited: boolean
  onReset: () => void
  children: React.ReactNode
}) {
  return (
    <Item size="xs" title={note} className="px-0 pt-0">
      <ItemContent>
        <ItemTitle className="text-caption">
          {label}
          {edited && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Reset ${label}`}
              title={`Reset ${label}`}
              className="size-4 shrink-0 p-0 text-muted-foreground [&_svg]:size-4"
              onClick={onReset}
            >
              <RotateCcwIcon />
            </Button>
          )}
        </ItemTitle>
      </ItemContent>
      <ItemActions>{children}</ItemActions>
    </Item>
  )
}

function ChoiceSelect({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => next && onChange(next)}
    >
      <SelectTrigger size="mini" aria-label={label} className="bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="end">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** A number you can type into; it commits only while the text is in range. */
function NumberField({
  label,
  hint,
  value,
  min,
  max,
  step,
  onCommit,
}: {
  label: string
  /** Shown on hover: what the number is, for a unit that needs it. */
  hint: string
  value: number
  min: number
  max: number
  step: number
  onCommit: (value: number) => void
}) {
  const shown = String(+value.toFixed(3))
  // The typed text wins while the field is being edited; otherwise the value.
  const [typed, setTyped] = React.useState<string | null>(null)

  return (
    <Input
      type="number"
      inputMode="decimal"
      aria-label={label}
      title={hint}
      value={typed ?? shown}
      min={min}
      max={max}
      step={step}
      size="mini"
      className="w-20 [appearance:textfield] bg-background tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      onChange={(event) => {
        setTyped(event.target.value)
        const next = event.target.valueAsNumber
        if (Number.isFinite(next) && next >= min && next <= max) onCommit(next)
      }}
      onBlur={() => setTyped(null)}
    />
  )
}
