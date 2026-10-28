import { ChoiceSelect, NumberField, SettingItem } from "./controls"
import type { Draft } from "./draft"
import { PanelSection } from "./section"
import { ShadowItem } from "./shadow-item"
import {
  densityOptions,
  densitySetting,
  shapeChanged,
  shapeGroups,
  toCss,
  toPx,
  type Density,
} from "./shape"

// What a pixel field may hold, per token: [min, max, step].
const ranges: Record<string, [number, number, number]> = {
  radius: [0, 32, 1],
  "shape-item": [0, 48, 1],
  "shape-control": [0, 48, 1],
  "shape-floating": [0, 48, 1],
  "shape-container": [0, 48, 1],
  "space-base": [2, 8, 0.5],
  "control-height": [24, 56, 1],
}

// What each group's numbers are measured in, shown beside its title.
const units: Record<string, string> = {
  corners: "px",
  spacing: "px",
  shadows: "px",
}

/**
 * The Shape tool: corner radii, the spacing unit and control height, and
 * shadow depth. Shared by light and dark, so there is no mode switch here.
 */
export function Shape({
  draft,
  density,
  onDensityChange,
}: {
  draft: Draft
  density: Density
  onDensityChange: (density: Density) => void
}) {
  const { shape, setShape, resetShape } = draft

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center bg-sidebar">
        <h2 className="text-title font-medium text-foreground">Shape</h2>
      </div>

      {shapeGroups.map((group, index) => (
        <PanelSection
          key={group.id}
          title={
            units[group.id]
              ? `${group.title} (${units[group.id]})`
              : group.title
          }
          note={group.note}
          defaultOpen={index === 0}
        >
          {group.rows.map((row) => {
            const [min, max, step] = ranges[row.token] ?? [0, 0, 1]
            if (row.kind === "shadow")
              return (
                <ShadowItem
                  key={row.token}
                  label={row.label}
                  note={row.note}
                  value={shape[row.token]}
                  edited={shapeChanged(row.token, shape[row.token])}
                  onChange={(value) => setShape(row.token, value)}
                  onReset={() => resetShape([row.token])}
                />
              )
            return (
              <SettingItem
                key={row.token}
                label={row.label}
                note={row.note}
                edited={shapeChanged(row.token, shape[row.token])}
                onReset={() => resetShape([row.token])}
              >
                <NumberField
                  label={`${row.label} in px`}
                  hint="Size in pixels"
                  value={toPx(shape[row.token], shape)}
                  min={min}
                  max={max}
                  step={step}
                  onCommit={(value) => setShape(row.token, toCss(value))}
                />
              </SettingItem>
            )
          })}
          {group.id === "spacing" && (
            <SettingItem
              label={densitySetting.label}
              note={densitySetting.note}
              edited={false}
              onReset={() => {}}
            >
              <ChoiceSelect
                label={densitySetting.label}
                items={densityOptions}
                value={density}
                onChange={(value) => onDensityChange(value as Density)}
              />
            </SettingItem>
          )}
        </PanelSection>
      ))}
    </div>
  )
}
