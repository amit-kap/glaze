"use client"

import type { ReactNode } from "react"

import { Tabs, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"

export type SegmentedControlOption<T extends string> = {
  value: T
  label: ReactNode
  disabled?: boolean
}

// One choice from a short, always-visible set: mode, density, viewport.
// Drawn with Tabs' segmented face — a muted track, a sliding pill behind the
// active option — so it keeps the same indicator animation and focus ring as
// Tabs instead of re-implementing them. Reach for ToggleGroup when options can
// be combined, and Select when the list is too long to show at once.
function SegmentedControl<T extends string>({
  className,
  label,
  size = "sm",
  value,
  onValueChange,
  options,
}: {
  className?: string
  /** Names the choice for assistive tech; not drawn. */
  label: string
  size?: "mini" | "sm" | "default"
  value: T
  onValueChange: (value: T) => void
  options: SegmentedControlOption<T>[]
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as T)}>
      <TabsList size={size} aria-label={label} className={className}>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { SegmentedControl }
