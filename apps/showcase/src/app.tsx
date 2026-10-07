import type * as React from "react"

import { ControlPanel } from "./control-panel"
import {
  ButtonsDemo,
  CalendarDemo,
  ChartDemo,
  ChatDemo,
  CheckboxDemo,
  ChoicesDemo,
  CommandDemo,
  ComposerDemo,
  PeopleDemo,
  RadioDemo,
  SignInDemo,
  SwitchesDemo,
  TableDemo,
  TabsDemo,
  ToolbarDemo,
} from "./demos"

// Each tile shows live components, centred, with their names in a footer
// strip. `wide` tiles span both columns.
const tiles: { name: string; demo: () => React.ReactNode; wide?: boolean }[] = [
  { name: "InputGroup", demo: ComposerDemo, wide: true },
  { name: "Button · Badge", demo: ButtonsDemo },
  { name: "ToggleGroup · Popover · DropdownMenu", demo: ToolbarDemo },
  { name: "Command", demo: CommandDemo, wide: true },
  { name: "Field · Input", demo: SignInDemo },
  { name: "Switch", demo: SwitchesDemo },
  { name: "Checkbox", demo: CheckboxDemo },
  { name: "RadioGroup", demo: RadioDemo },
  { name: "Message · Bubble · Attachment", demo: ChatDemo, wide: true },
  { name: "Select · Slider", demo: ChoicesDemo },
  { name: "Tabs · Progress · Accordion", demo: TabsDemo },
  { name: "Table", demo: TableDemo, wide: true },
  { name: "Calendar", demo: CalendarDemo },
  { name: "Avatar · Kbd", demo: PeopleDemo },
  { name: "Chart", demo: ChartDemo, wide: true },
]

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:py-10 xl:py-16">
        <ControlPanel />
        <main className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tiles.map(({ name, demo: Demo, wide }) => (
            <section
              key={name}
              aria-label={name}
              className={`tile flex flex-col overflow-hidden rounded-container ${wide ? "sm:col-span-2" : ""}`}
            >
              <div className="flex min-h-56 flex-1 items-center justify-center px-6 py-10">
                <Demo />
              </div>
              <div className="shrink-0 border-t border-border/40 px-4 py-3 text-body text-muted-foreground">
                {name}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
