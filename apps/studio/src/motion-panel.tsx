import { Switch } from "@amit-kap/glaze/components/switch"

import { NumberField, SettingItem } from "./controls"
import type { Draft } from "./draft"
import { EasingItem } from "./easing-item"
import {
  motionChanged,
  motionGroups,
  msToCss,
  reducedMotionGroup,
  toMs,
} from "./motion"
import { PanelSection } from "./section"

/**
 * The Motion tool: durations, easing curves and the exit ratio. Shared by
 * light and dark, so there is no mode switch here.
 */
export function Motion({
  draft,
  reduceMotion,
  onReduceMotionChange,
}: {
  draft: Draft
  reduceMotion: boolean
  onReduceMotionChange: (reduce: boolean) => void
}) {
  const { motion, setMotion, resetMotion } = draft

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center bg-sidebar">
        <h2 className="text-title font-medium text-foreground">Motion</h2>
      </div>

      {motionGroups.map((group, index) => (
        <PanelSection
          key={group.id}
          title={group.title}
          note={group.note}
          defaultOpen={index === 0}
        >
          {group.rows.map((row) => {
            const edited = motionChanged(row.token, motion[row.token])
            const reset = () => resetMotion([row.token])

            if (row.kind === "easing")
              return (
                <EasingItem
                  key={row.token}
                  label={row.label}
                  note={row.note}
                  value={motion[row.token]}
                  edited={edited}
                  onChange={(value) => setMotion(row.token, value)}
                  onReset={reset}
                />
              )

            return (
              <SettingItem
                key={row.token}
                label={row.label}
                note={row.note}
                edited={edited}
                onReset={reset}
              >
                {row.kind === "duration" ? (
                  <NumberField
                    label={`${row.label} in ms`}
                    hint="Duration in milliseconds"
                    value={toMs(motion[row.token])}
                    min={0}
                    max={2000}
                    step={10}
                    onCommit={(value) => setMotion(row.token, msToCss(value))}
                  />
                ) : (
                  <NumberField
                    label={row.label}
                    hint="Share of the entrance duration"
                    value={parseFloat(motion[row.token])}
                    min={0}
                    max={1}
                    step={0.05}
                    onCommit={(value) => setMotion(row.token, String(value))}
                  />
                )}
              </SettingItem>
            )
          })}
        </PanelSection>
      ))}

      <PanelSection
        title={reducedMotionGroup?.title ?? "Reduced motion"}
        note={reducedMotionGroup?.note}
      >
        <SettingItem
          label="Reduce motion"
          note="Preview with movement stopped and fades kept, as when the system asks for reduced motion."
          edited={false}
          onReset={() => {}}
        >
          <Switch
            size="sm"
            aria-label="Reduce motion"
            checked={reduceMotion}
            onCheckedChange={onReduceMotionChange}
          />
        </SettingItem>
      </PanelSection>
    </div>
  )
}
