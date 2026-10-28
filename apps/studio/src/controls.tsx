import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Input } from "@amit-kap/glaze/components/input"
import { Slider } from "@amit-kap/glaze/components/slider"
import { cn } from "@amit-kap/glaze/lib/utils"
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

// The rows every tool panel is made of: a label with its reset, and a small
// control on the right.

/** One setting: its label, a reset once edited, and the control, no card. */
export function SettingItem({
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

export function ChoiceSelect({
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
      <SelectTrigger size="sm" aria-label={label} className="bg-background">
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
export function NumberField({
  label,
  hint,
  value,
  min,
  max,
  step,
  className,
  onCommit,
}: {
  label: string
  /** Shown on hover: what the number is, for a unit that needs it. */
  hint: string
  value: number
  min: number
  max: number
  step: number
  className?: string
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
      size="sm"
      className={cn(
        "w-20 [appearance:textfield] bg-background tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className
      )}
      onChange={(event) => {
        setTyped(event.target.value)
        const next = event.target.valueAsNumber
        if (Number.isFinite(next) && next >= min && next <= max) onCommit(next)
      }}
      onBlur={() => setTyped(null)}
    />
  )
}

/** A label, a slider and the number it sets, on one line. */
export function SliderField({
  name,
  label,
  hint,
  value,
  min,
  max,
  step,
  onCommit,
}: {
  /** What the setting is, so the controls are told apart by a screen reader. */
  name: string
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  onCommit: (value: number) => void
}) {
  return (
    <div className="grid grid-cols-[5.25rem_1fr_4rem] items-center gap-2">
      <span className="truncate text-caption text-muted-foreground">
        {label}
      </span>
      <Slider
        aria-label={`${name} ${label}`}
        value={[Math.min(max, Math.max(min, value))]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => onCommit(Array.isArray(next) ? next[0] : next)}
      />
      <NumberField
        label={`${name} ${label}`}
        hint={hint}
        value={value}
        min={min}
        max={max}
        step={step}
        className="w-full"
        onCommit={onCommit}
      />
    </div>
  )
}
