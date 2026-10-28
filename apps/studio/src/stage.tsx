import * as React from "react"
import { LaptopIcon, Maximize2Icon, SmartphoneIcon } from "lucide-react"

import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"
import { cn } from "@amit-kap/glaze/lib/utils"

import { Chat } from "./chat"
import { Dashboard } from "./dashboard"
import { Landing } from "./landing"
import { Login } from "./login"
import { Settings } from "./settings"
import { cssVars, type Mode, type Theme } from "./theme"
import { motionVars, type MotionValues } from "./motion"
import { shapeVars, type Density, type ShapeValues } from "./shape"
import { typeVars, type TypeValues } from "./typography"

type Width = "fit" | "768" | "390"
type Screen = "dashboard" | "settings" | "login" | "chat" | "landing"

const screens: { id: Screen; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "settings", label: "Settings" },
  { id: "login", label: "Login" },
  { id: "chat", label: "Chat" },
  { id: "landing", label: "Landing" },
]

const preview: Record<Screen, React.ReactNode> = {
  dashboard: <Dashboard />,
  settings: <Settings />,
  login: <Login />,
  chat: <Chat />,
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
  theme,
  type,
  shape,
  density,
  motion,
  reduceMotion,
}: {
  mode: Mode
  theme: Theme
  type: TypeValues
  shape: ShapeValues
  density: Density
  motion: MotionValues
  reduceMotion: boolean
}) {
  const [screen, setScreen] = React.useState<Screen>("dashboard")
  const [width, setWidth] = React.useState<Width>("fit")

  return (
    <section
      data-theme="nova"
      className="flex min-w-0 flex-1 flex-col overflow-hidden"
      // Shape and motion sit on the themed section, not the wrapper below: the
      // kit derives its corner, size and duration tokens here, so they follow
      // these values. Reduced motion zeroes the movement scale, as the
      // system setting does.
      style={
        {
          ...shapeVars(shape),
          ...motionVars(motion),
          ...(reduceMotion && { "--motion-scale": "0" }),
        } as React.CSSProperties
      }
    >
      {/* Dark mode is scoped to the preview: the studio itself stays light. */}
      <div
        className={cn(
          "flex h-full min-h-0 flex-col bg-background p-4 font-sans font-normal text-foreground",
          mode === "dark" && "dark"
        )}
        style={{ ...cssVars(theme[mode]), ...typeVars(type) }}
      >
        <Tabs
          value={screen}
          onValueChange={(value) => setScreen(value as Screen)}
          className="h-full gap-4"
        >
          <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
            <TabsList variant="line">
              {screens.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="ms-auto flex items-center gap-3">
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
              data-density={density}
              className={cn(
                "@container h-full",
                width === "fit" && "w-full",
                width === "768" && "w-[768px] max-w-full",
                width === "390" && "w-[390px] max-w-full"
              )}
            >
              {screens.map((item) => (
                <TabsContent
                  key={item.id}
                  value={item.id}
                  className="h-full min-h-0 overflow-hidden rounded-lg border border-border bg-background"
                >
                  {preview[item.id]}
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
