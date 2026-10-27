import * as React from "react"

import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"
import { cn } from "@amit-kap/glaze/lib/utils"

import { Dashboard } from "./dashboard"
import { cssVars, type Mode, type Theme } from "./theme"

type Density = "comfortable" | "compact"
type Width = "fit" | "768" | "390"
type Screen = "dashboard" | "settings" | "login" | "chat"

const screens: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "settings", label: "Settings" },
  { id: "login", label: "Login" },
  { id: "chat", label: "Chat" },
]

export function Stage({ mode, theme }: { mode: Mode; theme: Theme }) {
  const [screen, setScreen] = React.useState<Screen>("dashboard")
  const [density, setDensity] = React.useState<Density>("comfortable")
  const [width, setWidth] = React.useState<Width>("fit")

  return (
    <section
      data-theme="nova"
      className="flex min-w-0 flex-1 flex-col overflow-hidden"
    >
      {/* Dark mode is scoped to the preview: the studio itself stays light. */}
      <div
        className={cn(
          "flex h-full min-h-0 flex-col bg-background p-4",
          mode === "dark" && "dark"
        )}
        style={cssVars(theme[mode])}
      >
        <Tabs
          value={screen}
          onValueChange={(value) => setScreen(value as Screen)}
          className="h-full gap-4"
        >
          <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
            <TabsList variant="line" className="bg-transparent p-0">
              {screens.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="px-2.5">
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="ms-auto flex items-center gap-3">
              <SegmentedControl
                label="Density"
                value={density}
                onValueChange={setDensity}
                options={[
                  { value: "comfortable", label: "Comfortable" },
                  { value: "compact", label: "Compact" },
                ]}
              />
              <SegmentedControl
                label="Preview width"
                value={width}
                onValueChange={setWidth}
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
              data-density={density}
              className={cn(
                "@container h-full",
                width === "fit" && "w-full",
                width === "768" && "w-[768px] max-w-full",
                width === "390" && "w-[390px] max-w-full"
              )}
            >
              <TabsContent
                value="dashboard"
                className="h-full min-h-0 overflow-hidden rounded-lg border border-border bg-background"
              >
                <Dashboard />
              </TabsContent>
              {screens
                .filter((item) => item.id !== "dashboard")
                .map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className="h-full min-h-0 overflow-hidden rounded-lg border border-border bg-background"
                  >
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <p className="text-caption text-muted-foreground">
                        The {item.label} screen will live here.
                      </p>
                    </div>
                  </TabsContent>
                ))}
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
