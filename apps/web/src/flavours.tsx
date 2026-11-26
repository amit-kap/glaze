import * as React from "react"

import { Label } from "@amit-kap/glaze/components/label"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { Slider } from "@amit-kap/glaze/components/slider"
import { cn } from "@amit-kap/glaze/lib/utils"
import { useTheme } from "@amit-kap/glaze/theme"
import { BadgeDemo, ButtonDemo } from "@showcase/demos/actions"
import { BubbleDemo } from "@showcase/demos/conversation"
import { CalendarDemo, ChartDemo } from "@showcase/demos/data"
import { ProgressDemo } from "@showcase/demos/feedback"
import {
  CheckboxDemo,
  FieldDemo,
  SliderDemo,
  SwitchDemo,
} from "@showcase/demos/inputs"
import { TabsDemo } from "@showcase/demos/navigation"
import { AvatarDemo } from "@showcase/demos/people"

import { Drips } from "./glaze"

type Flavour = {
  id: "glaze" | "nova" | "folio" | "volt"
  name: string
  note: string
  /** Swatch and pour colour. */
  colour: string
  /** Corner radius the theme sets, in rem. */
  radius: number
  /** The lines of CSS that make the theme what it is. */
  css: string[]
}

const flavours: Flavour[] = [
  {
    id: "glaze",
    name: "Glaze",
    note: "Pink icing, indigo ink",
    colour: "#fe6ccb",
    radius: 0.875,
    css: [
      "--primary: #370277;",
      "--brand: #fe6ccb;",
      "--border: #eed6f0;",
      "--radius: 0.875rem;",
    ],
  },
  {
    id: "nova",
    name: "Nova",
    note: "The neutral default",
    colour: "#262626",
    radius: 0.625,
    css: [
      "--primary: oklch(0.205 0 0);",
      "--border: oklch(0.922 0 0);",
      "--radius: 0.625rem;",
      '--typeface-sans: "Geist Variable";',
    ],
  },
  {
    id: "folio",
    name: "Folio",
    note: "Serif headings on warm paper",
    colour: "#b3522f",
    radius: 0.375,
    css: [
      "--primary: oklch(0.56 0.15 38);",
      "--background: oklch(0.985 0.011 80);",
      "--radius: 0.375rem;",
      '--typeface-heading: "Playfair Display";',
    ],
  },
  {
    id: "volt",
    name: "Volt",
    note: "Sharp corners, mono headings",
    colour: "#2f5bea",
    radius: 0.25,
    css: [
      "--primary: oklch(0.55 0.22 258);",
      "--radius: 0.25rem;",
      '--typeface-sans: "Inter Variable";',
      '--typeface-heading: "JetBrains Mono";',
    ],
  },
]

// When the pour covers the preview, in ms: the theme changes under it.
const COVERED = 440
const POUR = 1050

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function Cell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mb-4 flex break-inside-avoid items-center justify-center rounded-container border border-border bg-card p-5",
        className
      )}
    >
      {children}
    </div>
  )
}

/** The pieces of a product screen, all real components from the library. */
function Board() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <ChartDemo />
        <Cell className="mb-0 hidden xl:flex">
          <CalendarDemo />
        </Cell>
      </div>
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        <Cell>
          <ButtonDemo />
        </Cell>
        <Cell>
          <SwitchDemo />
        </Cell>
        <Cell>
          <TabsDemo />
        </Cell>
        <Cell>
          <BadgeDemo />
        </Cell>
        <Cell>
          <BubbleDemo />
        </Cell>
        <Cell>
          <FieldDemo />
        </Cell>
        <Cell>
          <SliderDemo />
        </Cell>
        <Cell>
          <ProgressDemo />
        </Cell>
        <Cell>
          <AvatarDemo />
        </Cell>
        <Cell>
          <CheckboxDemo />
        </Cell>
      </div>
    </div>
  )
}

function FlavourButton({
  flavour,
  selected,
  onSelect,
}: {
  flavour: Flavour
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-testid={`flavour-${flavour.id}`}
      onClick={onSelect}
      className={cn(
        "group/flavour flex items-center gap-3 rounded-container border border-border bg-card p-3 text-start transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-foreground" : "hover:bg-muted"
      )}
    >
      <span
        aria-hidden="true"
        style={{ backgroundColor: flavour.colour }}
        className={cn(
          "size-9 shrink-0 rounded-pill transition-transform ease-emphasized",
          selected ? "scale-110" : "group-hover/flavour:scale-105"
        )}
      />
      <span className="flex min-w-0 flex-col">
        <span className="font-brand text-title">{flavour.name}</span>
        <span className="truncate text-caption text-muted-foreground">
          {flavour.note}
        </span>
      </span>
    </button>
  )
}

/**
 * The live demo: one board of real components, re-themed by picking a
 * flavour. Each flavour is a Glaze theme (a block of custom properties in
 * app.css) applied to the preview alone with `data-theme`.
 */
export function Flavours() {
  const page = useTheme()
  const [flavour, setFlavour] = React.useState(flavours[0])
  const [pouring, setPouring] = React.useState<Flavour | null>(null)
  const [radius, setRadius] = React.useState(flavours[0].radius)
  const [mode, setMode] = React.useState<"light" | "dark">(page.resolvedMode)
  const [density, setDensity] = React.useState<"comfortable" | "compact">(
    "comfortable"
  )
  const timers = React.useRef<number[]>([])

  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  function apply(next: Flavour) {
    setFlavour(next)
    setRadius(next.radius)
  }

  function pick(next: Flavour) {
    if (next.id === flavour.id || pouring) return
    if (reducedMotion()) return apply(next)
    setPouring(next)
    timers.current = [
      window.setTimeout(() => apply(next), COVERED),
      window.setTimeout(() => setPouring(null), POUR),
    ]
  }

  return (
    // In source order the preview follows the flavours, so on a phone the
    // change is in view; on a wide screen it sits beside both control groups.
    <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
      <div className="grid grid-cols-2 gap-2 lg:col-start-1 lg:row-start-1 lg:grid-cols-1">
        {flavours.map((item) => (
          <FlavourButton
            key={item.id}
            flavour={item}
            selected={(pouring ?? flavour).id === item.id}
            onSelect={() => pick(item)}
          />
        ))}
      </div>

      <div
        data-testid="flavour-preview"
        data-theme={flavour.id}
        data-density={density === "compact" ? "compact" : undefined}
        style={{ "--radius": `${radius}rem` } as React.CSSProperties}
        className={cn(
          "relative h-[42rem] overflow-hidden rounded-container border border-border bg-background font-sans text-foreground shadow-floating lg:col-start-2 lg:row-span-2 lg:row-start-1",
          mode === "dark" && "dark"
        )}
      >
        <div className="flex h-10 items-center gap-2 border-b border-border px-4">
          <span className="size-2.5 rounded-pill bg-border" />
          <span className="size-2.5 rounded-pill bg-border" />
          <span className="size-2.5 rounded-pill bg-border" />
          <code className="ms-3 font-mono text-caption text-muted-foreground">
            {`<main data-theme="${flavour.id}">`}
          </code>
        </div>
        <div className="h-full overflow-hidden p-4 sm:p-6">
          <Board />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
        {pouring && (
          <div className="pour" style={{ color: pouring.colour }}>
            <Drips />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="flavour-radius">Corners</Label>
            <span className="font-mono text-caption text-muted-foreground">
              {radius.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}rem
            </span>
          </div>
          <Slider
            id="flavour-radius"
            aria-label="Corners"
            min={0}
            max={1.5}
            step={0.125}
            value={radius}
            onValueChange={(value) => setRadius(value as number)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SegmentedControl
            label="Mode"
            value={mode}
            onValueChange={setMode}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
          <SegmentedControl
            label="Density"
            value={density}
            onValueChange={setDensity}
            options={[
              { value: "comfortable", label: "Comfortable" },
              { value: "compact", label: "Compact" },
            ]}
          />
        </div>

        <pre className="overflow-x-auto rounded-container bg-muted p-4 font-mono text-caption leading-relaxed text-muted-foreground">
          <code>
            <span className="text-foreground">{`[data-theme="${flavour.id}"] {`}</span>
            {"\n"}
            {flavour.css.map((line) => `  ${line}\n`).join("")}
            <span className="text-foreground">{"}"}</span>
          </code>
        </pre>
      </div>
    </div>
  )
}
