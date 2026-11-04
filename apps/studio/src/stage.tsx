import * as React from "react"
import { LaptopIcon, Maximize2Icon, SmartphoneIcon } from "lucide-react"

import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"
import { PortalContainer } from "@amit-kap/glaze/components/portal-container"
import { cn } from "@amit-kap/glaze/lib/utils"

import { Checkout } from "./checkout"
import { Dashboard } from "./dashboard"
import { DataTableScreen } from "./data-table-screen"
import { Harness } from "./harness"
import { Landing } from "./landing"
import { cssVars, type Mode, type Theme } from "./theme"
import { motionVars, type MotionValues } from "./motion"
import { shapeVars, type Density, type ShapeValues } from "./shape"
import { typeVars, type TypeValues } from "./typography"

type Width = "fit" | "768" | "390"
type Screen = "dashboard" | "table" | "checkout" | "harness" | "landing"

const screens: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "table", label: "Data table" },
  { id: "checkout", label: "Checkout" },
  { id: "harness", label: "Harness" },
  { id: "landing", label: "Landing" },
]

const modes: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

const preview: Record<Screen, React.ReactNode> = {
  dashboard: <Dashboard />,
  table: <DataTableScreen />,
  checkout: <Checkout />,
  harness: <Harness />,
  landing: <Landing />,
}

/** A preview width as an icon, named for the pointer and for assistive tech. */
function WidthIcon({
  name,
  icon: Icon,
  className,
}: {
  name: string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <span title={name} className="inline-flex">
      <Icon className={className} />
      <span className="sr-only">{name}</span>
    </span>
  )
}

export function Stage({
  mode,
  onModeChange,
  theme,
  type,
  shape,
  density,
  motion,
  extraVars,
  reduceMotion,
}: {
  mode: Mode
  onModeChange: (mode: Mode) => void
  theme: Theme
  type: TypeValues
  shape: ShapeValues
  density: Density
  motion: MotionValues
  /** Component tokens a dial sets outright, as CSS custom properties. */
  extraVars: Record<string, string>
  reduceMotion: boolean
}) {
  const [screen, setScreen] = React.useState<Screen>("dashboard")
  const [width, setWidth] = React.useState<Width>("fit")
  // Popups mount inside the preview frame, so they wear the draft theme, and
  // the frame (a size container, so a containing block) keeps dialogs in it.
  const [frame, setFrame] = React.useState<HTMLElement | null>(null)

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 flex-col bg-background px-5 py-3 text-foreground">
        <Tabs
          value={screen}
          onValueChange={(value) => setScreen(value as Screen)}
          className="h-full gap-4"
        >
          <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
            <TabsList variant="line" className="gap-5">
              {screens.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="ms-auto flex items-center gap-3">
              <SegmentedControl
                size="sm"
                label="Mode being previewed"
                options={modes}
                value={mode}
                onValueChange={onModeChange}
              />
              <SegmentedControl
                label="Preview width"
                className="**:data-[slot=tabs-trigger]:w-8 **:data-[slot=tabs-trigger]:flex-none **:data-[slot=tabs-trigger]:px-0"
                value={width}
                onValueChange={setWidth}
                options={[
                  {
                    value: "fit",
                    label: (
                      <WidthIcon name="Fit to the stage" icon={Maximize2Icon} />
                    ),
                  },
                  {
                    value: "768",
                    label: (
                      <WidthIcon name="Narrow, 768 px wide" icon={LaptopIcon} />
                    ),
                  },
                  {
                    value: "390",
                    label: (
                      <WidthIcon
                        name="Phone, 390 px wide"
                        icon={SmartphoneIcon}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 justify-center">
            <div
              ref={setFrame}
              data-theme="nova"
              data-density={density}
              // Only this frame wears the draft: the toolbar above stays the
              // studio's own. Every theme value sits on the themed element,
              // since the kit derives tokens at `[data-theme]` and a derived
              // token reads its source where it is declared. Dark mode is
              // scoped here too. Reduced motion zeroes the movement scale,
              // as the system setting does.
              style={
                {
                  ...cssVars(theme[mode]),
                  ...typeVars(type),
                  ...shapeVars(shape),
                  ...motionVars(motion),
                  ...extraVars,
                  ...(reduceMotion && { "--motion-scale": "0" }),
                } as React.CSSProperties
              }
              className={cn(
                "@container h-full font-sans font-normal text-foreground [contain:layout]",
                mode === "dark" && "dark",
                width === "fit" && "w-full",
                width === "768" && "w-[768px] max-w-full",
                width === "390" && "w-[390px] max-w-full"
              )}
            >
              <PortalContainer container={frame}>
                {screens.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className="h-full min-h-0 overflow-hidden rounded-container border border-border bg-background"
                  >
                    {preview[item.id]}
                  </TabsContent>
                ))}
              </PortalContainer>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
