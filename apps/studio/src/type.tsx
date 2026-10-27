import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"

import { ChoiceSelect, NumberField, SettingItem } from "./controls"
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
              <SettingItem
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
                    value={String(toNumber(type[row.token]))}
                    onValueChange={(value) => setType(row.token, value)}
                  />
                )}
              </SettingItem>
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
      <SettingItem
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
            value={toNumber(type[row.token])}
            min={8}
            max={96}
            step={1}
            onCommit={(value) => setType(row.token, toCss(row.token, value))}
          />
          <NumberField
            label={`${row.label} line height`}
            hint="Line height, as a multiple of the text size"
            value={toNumber(type[leading])}
            min={0.8}
            max={3}
            step={0.05}
            onCommit={(value) => setType(leading, toCss(leading, value))}
          />
        </div>
      </SettingItem>
    )
  })
}
