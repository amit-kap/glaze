import type * as React from "react"

import { Card, CardContent, CardDescription, CardFooter } from "@amit-kap/glaze/components/card"

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

// Each tile is a Glaze Card: live components, centred, with their names in
// the footer. `wide` tiles span both columns.
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
            <Card key={name} aria-label={name} className={wide ? "sm:col-span-2" : undefined}>
              <CardContent className="flex min-h-56 flex-1 items-center justify-center">
                <Demo />
              </CardContent>
              <CardFooter>
                <CardDescription>{name}</CardDescription>
              </CardFooter>
            </Card>
          ))}
        </main>
      </div>
    </div>
  )
}
