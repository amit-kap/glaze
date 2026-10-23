import * as React from "react"

import { cn } from "@amit-kap/glaze/lib/utils"

import { Dashboard } from "./dashboard"
import { cssVars, type Color, type Mode, type Token } from "./theme"

type Density = "comfortable" | "compact"
type Width = "fit" | "768" | "390"
type Screen = "dashboard" | "settings" | "login" | "chat"

const screens: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "settings", label: "Settings" },
  { id: "login", label: "Login" },
  { id: "chat", label: "Chat" },
]

export function Stage({
  mode,
  onModeChange,
  theme,
}: {
  mode: Mode
  onModeChange: (mode: Mode) => void
  theme: Record<Mode, Record<Token, Color>>
}) {
  const [screen, setScreen] = React.useState<Screen>("dashboard")
  const [density, setDensity] = React.useState<Density>("comfortable")
  const [width, setWidth] = React.useState<Width>("fit")

  const current = screens.find((item) => item.id === screen)!

  return (
    <section
      data-theme="nova"
      className="flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      {/* Dark mode is scoped to the preview: the studio itself stays light. */}
      <div
        className={cn(
          "flex h-full min-h-0 flex-col gap-4 bg-background p-4",
          mode === "dark" && "dark",
        )}
        style={cssVars(theme[mode])}
      >
        <div className="flex h-12 shrink-0 items-center gap-3">
          <nav aria-label="Preview screens" className="flex items-center">
            {screens.map((item) => {
              const active = item.id === screen
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setScreen(item.id)}
                  className={cn(
                    "flex h-12 items-center border-b-2 px-2.5 text-caption transition-colors",
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="ms-auto flex items-center gap-3">
            <Segment
              label="Mode"
              value={mode}
              onChange={onModeChange}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
            <Segment
              label="Density"
              value={density}
              onChange={setDensity}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
            <Segment
              label="Preview width"
              value={width}
              onChange={setWidth}
              options={[
                { value: "fit", label: "Fit" },
                { value: "768", label: "768" },
                { value: "390", label: "390" },
              ]}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 justify-center">
          <div
            className={cn(
              "@container h-full",
              width === "fit" && "w-full",
              width === "768" && "w-[768px] max-w-full",
              width === "390" && "w-[390px] max-w-full",
            )}
          >
            <div
              data-density={density}
              className="h-full overflow-hidden rounded-lg border border-border bg-background"
            >
              {screen === "dashboard" ? (
                <Dashboard />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <p className="text-caption text-muted-foreground">
                    The {current.label} screen will live here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Segment<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-0.5 rounded-control bg-muted p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-6 rounded-item-sm px-2 text-caption transition-colors",
              active
                ? "bg-card text-foreground shadow-raised ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
