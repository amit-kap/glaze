import * as React from "react"
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import { FieldLabel } from "@amit-kap/glaze/components/field"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

import type { ThemeEditor } from "../editor"
import { ColorField, ColorSwatch, Section, toHex } from "../fields"
import { brandRows, chartRows, statusRows } from "../../theme-builder"

// One derived token inside a colour row's drill-down, at caption scale:
// swatch opens the same picker as a full colour field, the name truncates
// with a tooltip rather than clipping, and the hex sits in a fixed column.
// Once pinned, the token stops following the input — the name goes solid
// and the reset button returns it to the derivation.
export function DerivedRow({
  name,
  editor,
}: {
  name: string
  editor: ThemeEditor
}) {
  const { mode } = editor
  const token = name.slice(2)
  const overridden = editor.systemOverridden(mode, token)
  const value = editor.system(mode, token)
  return (
    <div className="flex h-6 items-center gap-2">
      <ColorSwatch
        label={name}
        value={value}
        onChange={(hex) => editor.setSystem(mode, token, hex)}
      />
      <span
        title={name}
        className={cn(
          "min-w-0 flex-1 truncate font-mono text-caption",
          overridden ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {name}
      </span>
      <span className="shrink-0 font-mono text-caption text-muted-foreground">
        {toHex(value)}
      </span>
      {/* Fixed slot, so the hex column never shifts when a pin is set. */}
      <span className="flex size-control-xs shrink-0 items-center justify-center">
        {overridden && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Reset ${name} to derived`}
            title="Reset to derived"
            onClick={() => editor.setSystem(mode, token, null)}
          >
            <RotateCcwIcon />
          </Button>
        )}
      </span>
    </div>
  )
}

// One labelled colour field, editing the active mode, expandable to the
// tier-2 tokens the input feeds. The input's own token ("--overlay" under
// Overlay, "--chart-1" under Chart 1) is itself, so it isn't listed.
export function ColorRow({
  label,
  self,
  derives,
  value,
  onChange,
  editor,
}: {
  label: string
  self: string
  derives: string[]
  value: string
  onChange: (hex: string) => void
  editor: ThemeEditor
}) {
  const [open, setOpen] = React.useState(false)
  const drillable = derives.filter((name) => name !== `--${self}`)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<FieldLabel className="w-20 shrink-0" />}>
            {label}
          </TooltipTrigger>
          <TooltipContent side="inline-start">
            {derives.join(" ")}
          </TooltipContent>
        </Tooltip>
        <ColorField label={label} value={value} onChange={onChange} />
        {drillable.length > 0 ? (
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon-xs" />}
            aria-label={`Tokens fed by ${label}`}
            aria-expanded={open}
          >
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-(--duration-fast)",
                open && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        ) : (
          // Keeps the colour fields aligned with the drillable rows'.
          <span aria-hidden="true" className="size-control-xs" />
        )}
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 ps-14 pt-2 pb-1">
          {drillable.map((name) => (
            <DerivedRow key={name} name={name} editor={editor} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const colorGroups = [
  { label: "Color", rows: brandRows },
  { label: "Status", rows: statusRows },
  { label: "Charts", rows: chartRows },
]

export function ColorsTab({ editor }: { editor: ThemeEditor }) {
  const { mode } = editor
  return (
    <>
      {colorGroups.map((group, i) => (
        <Section
          key={group.label}
          title={group.label}
          defaultOpen={i === 0}
          dots={group.rows.map((r) => editor.color(mode, r.key))}
        >
          {group.rows.map(({ key, label, derives }) => (
            <ColorRow
              key={key}
              label={label}
              self={key}
              derives={derives}
              value={editor.color(mode, key)}
              onChange={(hex) => editor.setColor(mode, key, hex)}
              editor={editor}
            />
          ))}
        </Section>
      ))}
    </>
  )
}
