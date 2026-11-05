import * as React from "react"

import { ControlPanel } from "./control-panel"
import { DemoTile, tiles } from "./tiles"

export function App() {
  const [customizing, setCustomizing] = React.useState(false)
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Tiles fill the width, with room at the bottom for the settings bar. */}
      <div
        className={`px-3 pt-3 pb-32 transition-[padding] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:px-6 sm:pt-6 [html[data-panel-dragging]_&]:transition-none ${customizing ? "lg:pe-[calc(var(--panel-w,420px)+--spacing(6))]" : ""}`}
      >
        <main className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {tiles.map(({ name, demo: Demo, wide }) => (
            <DemoTile key={name} name={name} wide={wide}>
              <Demo />
            </DemoTile>
          ))}
        </main>
      </div>
      <ControlPanel open={customizing} onOpenChange={setCustomizing} />
    </div>
  )
}
