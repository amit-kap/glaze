import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { useTheme } from "@amit-kap/glaze/theme"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@amit-kap/glaze/components/input-group"
import { toast } from "@amit-kap/glaze/components/toast"

import { ControlPanel, themes } from "./control-panel"
import {
  CalendarDemo,
  ChartDemo,
  ChatDemo,
  CommandDemo,
  EmptyDemo,
  IssuesDemo,
  SettingsDemo,
  SignInDemo,
  TabsDemo,
  ToolbarDemo,
} from "./demos"

const install = "npm install @amit-kap/glaze"

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-2 font-heading text-title font-strong">
            <span className="size-5 rounded-item bg-primary" aria-hidden />
            Glaze
          </a>
          <ControlPanel />
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-16 pb-24 sm:px-6 sm:pt-20">
        <Hero />
        <section aria-label="Component showcase" className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {[
            SignInDemo,
            ChartDemo,
            ToolbarDemo,
            SettingsDemo,
            ChatDemo,
            CommandDemo,
            IssuesDemo,
            CalendarDemo,
            TabsDemo,
            EmptyDemo,
          ].map((Demo, i) => (
            <div key={i} className="mb-6 break-inside-avoid">
              <Demo />
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-6 sm:px-6 text-body text-muted-foreground">
          <span>Glaze · shadcn/ui on Base UI, themed through tokens · MIT</span>
          <div className="flex gap-1">
            <Button variant="link" size="sm" nativeButton={false} render={<a href="https://www.npmjs.com/package/@amit-kap/glaze" />}>
              npm
            </Button>
            <Button variant="link" size="sm" nativeButton={false} render={<a href="https://github.com/amit-kap/glaze" />}>
              GitHub
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Hero() {
  const { theme } = useTheme()
  const current = themes.find((t) => t.value === theme)

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <Badge variant="secondary" className="w-fit">
        {current ? `${current.label} · ${current.note}` : theme}
      </Badge>
      <h1 className="font-heading text-4xl font-strong sm:text-5xl tracking-tight text-balance">
        One component library. Any look.
      </h1>
      <p className="text-title text-muted-foreground text-pretty">
        shadcn/ui components on Base UI, with every visual decision in tokens. Pick a theme, mode and
        density at the top right: the same components re-style instantly.
      </p>
      <InstallCommand />
    </section>
  )
}

function InstallCommand() {
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(install)
      setCopied(true)
      toast.add({ type: "success", title: "Copied to clipboard" })
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.add({ type: "error", title: "Couldn't copy. Select the command instead." })
    }
  }

  return (
    <InputGroup className="max-w-md font-mono">
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput readOnly value={install} aria-label="Install command" className="font-mono" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Copy install command" onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
