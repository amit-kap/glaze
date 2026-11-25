import * as React from "react"
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { IconSwitch } from "@amit-kap/glaze/components/icon-switch"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"
import { Separator } from "@amit-kap/glaze/components/separator"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"
import { useTheme } from "@amit-kap/glaze/theme"

import { installCommand, links } from "./links"
import { Logo } from "./logo"

const navigation = [
  { label: "Components", href: links.showcase },
  { label: "Studio", href: links.studio },
  { label: "Storybook", href: links.storybook },
  { label: "GitHub", href: links.github },
]

const features = [
  {
    title: "Accessible primitives",
    description: "Built on Base UI, following shadcn/ui conventions.",
  },
  {
    title: "Shared theming",
    description:
      "One set of settings changes every component; exceptions are named and visible.",
  },
  {
    title: "Nova and your own themes",
    description:
      "Nova is the one built-in theme. Make yours in Studio or by hand.",
  },
  {
    title: "Mode, density and scope",
    description:
      "Light and dark, comfortable and compact, and a theme can apply to one section of a page.",
  },
]

const destinations = [
  {
    title: "Showcase",
    description: "One tile per component, with its variants.",
    href: links.showcase,
  },
  {
    title: "Studio",
    description:
      "Edit a theme against Nova, preview it on the real components and export it.",
    href: links.studio,
  },
]

const container = "mx-auto w-full max-w-5xl px-4 sm:px-6"
const headline =
  "font-heading font-medium tracking-tight text-balance text-[length:calc(var(--type-display)*2)] leading-[1.1] sm:text-[length:calc(var(--type-display)*2.75)]"
const sectionTitle = "font-heading text-title font-medium"

function ModeToggle() {
  const { resolvedMode, setMode } = useTheme()
  return (
    <IconSwitch
      size="sm"
      aria-label="Dark mode"
      checked={resolvedMode === "dark"}
      onCheckedChange={(dark) => setMode(dark ? "dark" : "light")}
      icon={<SunIcon />}
      checkedIcon={<MoonIcon />}
    />
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background/80 backdrop-blur">
      <div className={`${container} flex h-14 items-center gap-2`}>
        <a
          href="./"
          className="me-auto flex items-center gap-2 rounded-control font-heading text-title font-medium"
        >
          <Logo />
          Glaze
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {navigation.map(({ label, href }) => (
            <Button
              key={label}
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<a href={href} />}
            >
              {label}
            </Button>
          ))}
        </nav>
        <ModeToggle />
      </div>
    </header>
  )
}

function InstallCommand() {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked: the command stays selectable on the page.
    }
  }

  return (
    <div className="flex h-control-lg w-fit max-w-full items-center gap-2 rounded-control border border-border bg-muted ps-3 pe-1">
      <span
        aria-hidden="true"
        className="font-mono text-body text-muted-foreground"
      >
        $
      </span>
      <code
        data-testid="install-command"
        className="min-w-0 truncate font-mono text-body select-all"
      >
        {installCommand}
      </code>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy install command"
              onClick={copy}
            />
          }
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
      </Tooltip>
    </div>
  )
}

function Hero() {
  return (
    <section
      data-testid="home-hero"
      className={`${container} flex flex-col items-start gap-6 pt-16 pb-12 sm:pt-24 sm:pb-16`}
    >
      <h1 className={`${headline} max-w-3xl`}>
        The style layer for your components.
      </h1>
      <p className="max-w-xl text-title text-muted-foreground">
        Glaze is a React component library built on shadcn/ui and Base UI,
        themed entirely through CSS custom properties.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="lg"
          data-testid="link-showcase"
          nativeButton={false}
          render={<a href={links.showcase} />}
        >
          Browse components
        </Button>
        <Button
          size="lg"
          variant="outline"
          data-testid="link-studio"
          nativeButton={false}
          render={<a href={links.studio} />}
        >
          Open Studio
        </Button>
      </div>
      <InstallCommand />
    </section>
  )
}

function Preview() {
  const [notify, setNotify] = React.useState(true)

  return (
    <section aria-label="Components" className={`${container} pb-16 sm:pb-24`}>
      <div className="grid gap-6 rounded-container border border-border bg-muted/50 p-4 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="preview-email">Email</Label>
            <Input
              id="preview-email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="preview-notify"
              checked={notify}
              onCheckedChange={setNotify}
            />
            <Label htmlFor="preview-notify">Notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="preview-terms" defaultChecked />
            <Label htmlFor="preview-terms">Accept the terms</Label>
          </div>
        </div>

        <Tabs defaultValue="account" className="sm:col-span-2 lg:col-span-1">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-3 text-muted-foreground">
            Your profile and sign-in details.
          </TabsContent>
          <TabsContent value="theme" className="pt-3 text-muted-foreground">
            Colour, shape, type and motion.
          </TabsContent>
          <TabsContent value="export" className="pt-3 text-muted-foreground">
            A config file you apply with one command.
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section
      aria-label="Features"
      className={`${container} grid gap-x-8 gap-y-8 pb-16 sm:grid-cols-2 sm:pb-24 lg:grid-cols-4`}
    >
      {features.map(({ title, description }) => (
        <div key={title} className="flex flex-col gap-2">
          <Separator />
          <h2 className={`${sectionTitle} pt-3`}>{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      ))}
    </section>
  )
}

function Destinations() {
  return (
    <section
      aria-label="Explore"
      className={`${container} grid gap-4 pb-16 sm:grid-cols-2 sm:pb-24`}
    >
      {destinations.map(({ title, description, href }) => (
        <a
          key={title}
          href={href}
          className="group/link rounded-container outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Card className="h-full transition-colors group-hover/link:bg-muted">
            <CardHeader className="gap-2">
              <CardTitle className="flex items-center justify-between font-heading text-heading">
                {title}
                <ArrowUpRightIcon className="size-5 text-muted-foreground transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ))}
    </section>
  )
}

function Footer() {
  const items = [
    { label: "GitHub", href: links.github },
    { label: "npm", href: links.npm },
    { label: "Storybook", href: links.storybook },
  ]
  return (
    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-6 text-caption text-muted-foreground`}
      >
        <span className="me-auto">MIT License</span>
        {items.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-item transition-colors hover:text-foreground"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Preview />
        <Features />
        <Destinations />
      </main>
      <Footer />
    </div>
  )
}
