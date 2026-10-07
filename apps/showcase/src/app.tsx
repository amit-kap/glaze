import type * as React from "react"

import { ControlPanel } from "./control-panel"
import {
  ButtonsDemo,
  CalendarDemo,
  ChartDemo,
  ChatDemo,
  ChoicesDemo,
  CommandDemo,
  ComposerDemo,
  PeopleDemo,
  SignInDemo,
  SwitchesDemo,
  TableDemo,
  TabsDemo,
  ToolbarDemo,
} from "./demos"

// Each tile holds one live component, centred. `wide` tiles span both columns.
const tiles: { demo: () => React.ReactNode; wide?: boolean }[] = [
  { demo: ComposerDemo, wide: true },
  { demo: ButtonsDemo },
  { demo: ToolbarDemo },
  { demo: CommandDemo, wide: true },
  { demo: SignInDemo },
  { demo: SwitchesDemo },
  { demo: ChatDemo, wide: true },
  { demo: ChoicesDemo },
  { demo: TabsDemo },
  { demo: TableDemo, wide: true },
  { demo: CalendarDemo },
  { demo: PeopleDemo },
  { demo: ChartDemo, wide: true },
]

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:py-10 xl:py-16">
        <ControlPanel />
        <main className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tiles.map(({ demo: Demo, wide }, i) => (
            <section
              key={i}
              className={`flex min-h-56 items-center justify-center rounded-container border p-6 sm:p-8 ${wide ? "sm:col-span-2" : ""}`}
            >
              <Demo />
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
