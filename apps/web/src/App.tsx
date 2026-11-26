import * as React from "react"
import { CheckIcon, CopyIcon, MoonIcon, SunIcon } from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { IconSwitch } from "@amit-kap/glaze/components/icon-switch"
import { Input } from "@amit-kap/glaze/components/input"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"
import { Label } from "@amit-kap/glaze/components/label"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"
import { cn } from "@amit-kap/glaze/lib/utils"
import { useTheme } from "@amit-kap/glaze/theme"

import studioShot from "./assets/studio.jpg"
import { Drips, Goo, Sprinkles } from "./glaze"
import { installCommand, links } from "./links"
import { Logo } from "./logo"

// The live demo carries the showcase demos and the chart library, so it loads
// after the hero has painted.
const Flavours = React.lazy(() =>
  import("./flavours").then((module) => ({ default: module.Flavours }))
)

const container = "mx-auto w-full max-w-7xl px-5 sm:px-8"

const navigation = [
  { label: "Components", href: links.showcase },
  { label: "Studio", href: links.studio },
  { label: "Storybook", href: links.storybook },
  { label: "GitHub", href: links.github },
]

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
    <header className={`${container} flex h-16 items-center gap-2`}>
      <a
        href="./"
        className="font-brand me-auto flex items-center gap-2 rounded-control text-heading"
      >
        <Logo className="size-9" />
        glaze
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
    <div className="flex h-control-lg w-fit max-w-full items-center gap-2 rounded-control bg-card ps-3 pe-1">
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

// [x%, y%, rotation]: kept clear of the headline and the buttons.
const heroSprinkles: [number, number, number][] = [
  [46, 12, 32],
  [53, 30, -48],
  [47, 55, 74],
  [57, 78, 18],
  [93, 14, -24],
  [96, 62, 58],
  [72, 90, -62],
  [34, 88, 40],
  [22, 96, -30],
]

function Hero() {
  return (
    <section
      data-theme="glaze"
      className="poster relative z-raised bg-background text-foreground"
    >
      <Header />
      <Sprinkles points={heroSprinkles} className="hidden md:block" />
      <div
        data-testid="home-hero"
        className={`${container} relative grid items-center gap-x-10 gap-y-6 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_auto]`}
      >
        <div className="flex flex-col items-start gap-7">
          <h1 className="flex flex-col gap-3">
            <span className="font-brand text-wordmark pb-[0.17em]">glaze</span>
            <span className="max-w-xl font-heading text-display font-medium text-balance sm:text-[length:calc(var(--type-display)*1.5)] sm:leading-tight">
              The style layer for your components.
            </span>
          </h1>
          <p className="text-lede max-w-lg text-muted-foreground">
            A React component library where every colour, corner and typeface is
            a setting. Change one and every component follows.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              className="h-12 px-6 text-title"
              data-testid="link-showcase"
              nativeButton={false}
              render={<a href={links.showcase} />}
            >
              Browse components
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-6 text-title"
              data-testid="link-studio"
              nativeButton={false}
              render={<a href={links.studio} />}
            >
              Open Studio
            </Button>
          </div>
          <InstallCommand />
        </div>
        <Logo className="donut size-[clamp(13rem,36vw,31rem)] justify-self-center lg:justify-self-end" />
      </div>
      <Drips drop className="text-glaze-frosting" />
    </section>
  )
}

function SectionHeading({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-4", className)}>
      <h2 className="font-brand text-poster text-balance">{title}</h2>
      <p className="text-lede text-muted-foreground">{children}</p>
    </div>
  )
}

function FlavourSection() {
  return (
    <section
      aria-label="Themes"
      className={`${container} flex flex-col gap-12 pt-56 pb-24 sm:pt-64 sm:pb-32`}
    >
      <SectionHeading title="One library. Pick a flavour.">
        These are real Glaze components. A theme is a short block of CSS, so the
        same button, chart and calendar can look like four different products.
      </SectionHeading>
      <React.Suspense fallback={<div className="h-[42rem]" />}>
        <Flavours />
      </React.Suspense>
    </section>
  )
}

const special: Record<string, string> = { otp: "OTP" }
const componentName = (id: string) =>
  id
    .split("-")
    .map((word) => special[word] ?? word[0].toUpperCase() + word.slice(1))
    .join(" ")

const chips = [
  "bg-glaze-frosting text-glaze-ink",
  "border-2 border-foreground text-foreground",
  "bg-primary text-primary-foreground",
  "bg-glaze-sprinkle text-glaze-ink",
]

function Ribbon({
  ids,
  offset,
  reverse,
  seconds,
}: {
  ids: string[]
  offset: number
  reverse?: boolean
  seconds: number
}) {
  // Rendered twice so the loop has no seam; the copy is hidden from
  // assistive tech and from the Tab order.
  const run = (copy: boolean) =>
    ids.map((id, index) => (
      <a
        key={`${id}-${copy}`}
        href={`${links.showcase}#/${id}`}
        aria-hidden={copy || undefined}
        tabIndex={copy ? -1 : undefined}
        // Not cn(): it would read text-ribbon (a size) and the chip's text
        // colour as the same setting and drop one.
        className={`font-brand text-ribbon me-3 flex shrink-0 items-center rounded-pill px-7 py-3.5 whitespace-nowrap transition-transform ease-emphasized outline-none hover:-translate-y-1 hover:-rotate-2 focus-visible:ring-2 focus-visible:ring-ring ${chips[(index + offset) % chips.length]}`}
      >
        {componentName(id)}
      </a>
    ))

  return (
    <div className="ribbon-row overflow-hidden py-1.5">
      <div
        className="ribbon"
        data-reverse={reverse ? "" : undefined}
        style={{ "--ribbon-time": `${seconds}s` } as React.CSSProperties}
      >
        {run(false)}
        {run(true)}
      </div>
    </div>
  )
}

function Wall() {
  const ids = __COMPONENTS__
  const third = Math.ceil(ids.length / 3)
  return (
    <section
      aria-label="Components"
      className="flex flex-col gap-10 pb-24 sm:pb-32"
    >
      <div
        className={`${container} flex flex-wrap items-end justify-between gap-6`}
      >
        <SectionHeading title={`${ids.length} components, all of them themed.`}>
          Buttons and inputs, charts and calendars, chat bubbles and command
          menus. Each one has a page with every variant.
        </SectionHeading>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<a href={links.showcase} />}
        >
          Browse components
        </Button>
      </div>
      <div className="flex flex-col">
        <Ribbon ids={ids.slice(0, third)} offset={0} seconds={70} />
        <Ribbon
          ids={ids.slice(third, third * 2)}
          offset={2}
          seconds={85}
          reverse
        />
        <Ribbon ids={ids.slice(third * 2)} offset={1} seconds={75} />
      </div>
    </section>
  )
}

const studioSteps = [
  "Start from Nova, Folio or Volt.",
  "Tune colour, type, corners and motion on the real components.",
  "Export one config file and apply it with a command.",
]

function Studio() {
  return (
    <section
      data-theme="glaze"
      aria-label="Glaze Studio"
      className="poster-ink relative overflow-hidden bg-background text-foreground"
    >
      <div
        className={`${container} grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
      >
        <div className="flex flex-col items-start gap-8">
          <SectionHeading title="Mix your own in Studio.">
            Studio is the theme editor for Glaze. It runs in the browser and
            keeps your themes there.
          </SectionHeading>
          <ol className="flex flex-col gap-4">
            {studioSteps.map((step, index) => (
              <li key={step} className="text-lede flex items-baseline gap-4">
                <span className="font-brand text-glaze-pink text-heading">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Button
            size="lg"
            nativeButton={false}
            render={<a href={links.studio} />}
          >
            Open Studio
          </Button>
        </div>
        <a
          href={links.studio}
          aria-label="Open Studio"
          className="group/shot relative block rounded-container outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src={studioShot}
            alt="Glaze Studio: a theme being edited beside a live preview of the components"
            width={2160}
            height={1350}
            loading="lazy"
            className="border-glaze-pink w-full rotate-2 rounded-container border-4 shadow-modal transition-transform ease-emphasized group-hover/shot:scale-[1.02] group-hover/shot:rotate-0"
          />
          <Logo className="absolute -inset-e-4 -top-10 size-28 -rotate-12 sm:-inset-e-8 sm:size-36" />
        </a>
      </div>
    </section>
  )
}

function Sample({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-3 rounded-container border border-border bg-background p-4 font-sans text-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

function Order() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">Half dozen, glazed</span>
        <Badge>Ready</Badge>
      </div>
      <div className="flex gap-2">
        <Button size="sm">Collect</Button>
        <Button size="sm" variant="outline">
          Details
        </Button>
      </div>
    </>
  )
}

function Feature({
  title,
  description,
  className,
  children,
}: {
  title: string
  description: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-8 rounded-container bg-muted p-6 sm:p-8",
        className
      )}
    >
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="font-brand text-heading">{title}</h3>
        <p className="text-title text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

function Inside() {
  const [notify, setNotify] = React.useState(true)
  return (
    <section
      aria-label="What is inside"
      className={`${container} flex flex-col gap-12 py-24 sm:py-32`}
    >
      <SectionHeading title="Sweet on the outside, precise underneath.">
        Glaze is built on shadcn/ui and Base UI. The parts you would otherwise
        build yourself are already done.
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-12">
        <Feature
          className="lg:col-span-7"
          title="Light and dark, anywhere"
          description="Every theme carries both. The mode is a class, so one card can go dark while the page stays light."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Sample data-theme="glaze">
              <Order />
            </Sample>
            <Sample data-theme="glaze" className="dark">
              <Order />
            </Sample>
          </div>
        </Feature>
        <Feature
          className="lg:col-span-5"
          title="Keyboard first"
          description="Focus, roles and keys come from Base UI. Press Tab and try these."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Save</Button>
              <div className="flex items-center gap-2">
                <Switch
                  id="inside-notify"
                  checked={notify}
                  onCheckedChange={setNotify}
                />
                <Label htmlFor="inside-notify">Notify me</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="inside-terms" defaultChecked />
                <Label htmlFor="inside-terms">Gift wrap</Label>
              </div>
            </div>
            <KbdGroup>
              <Kbd>Tab</Kbd>
              <Kbd>Space</Kbd>
              <Kbd>Enter</Kbd>
              <Kbd>Esc</Kbd>
            </KbdGroup>
          </div>
        </Feature>
        <Feature
          className="lg:col-span-5"
          title="Two densities"
          description="Comfortable by default, compact for a busy table or a side panel."
        >
          <div className="flex flex-col gap-3">
            <Sample className="flex-row items-center">
              <Input
                aria-label="Comfortable example"
                placeholder="Comfortable"
              />
              <Button>Add</Button>
            </Sample>
            <Sample data-density="compact" className="flex-row items-center">
              <Input aria-label="Compact example" placeholder="Compact" />
              <Button>Add</Button>
            </Sample>
          </div>
        </Feature>
        <Feature
          className="lg:col-span-7"
          title="A theme for one section"
          description="Put data-theme on any element and everything inside wears that theme."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {(["glaze", "folio", "volt"] as const).map((theme) => (
              <Sample key={theme} data-theme={theme}>
                <code className="font-mono text-caption text-muted-foreground">
                  {`data-theme="${theme}"`}
                </code>
                <span className="font-heading text-title font-medium">
                  Order ready
                </span>
                <Button size="sm">Collect</Button>
              </Sample>
            ))}
          </div>
        </Feature>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Add Glaze to your app",
    code: installCommand,
  },
  {
    title: "Use a component",
    code: 'import { Button } from "@amit-kap/glaze/components/button"',
  },
  {
    title: "Apply a theme from Studio",
    code: `${installCommand} --config glaze.config.json`,
  },
]

function Start() {
  return (
    <section
      aria-label="Get started"
      className={`${container} grid gap-12 pb-24 sm:pb-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
    >
      <SectionHeading title="Three steps to a glazed app.">
        Glaze installs into a React project that uses Tailwind CSS 4.
      </SectionHeading>
      <ol className="flex flex-col gap-6">
        {steps.map(({ title, code }, index) => (
          <li key={title} className="flex gap-5">
            <span className="bg-glaze-frosting font-brand text-glaze-ink flex size-10 shrink-0 items-center justify-center rounded-pill text-title">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1.5">
              <h3 className="text-lede font-medium">{title}</h3>
              <pre className="overflow-x-auto rounded-control bg-muted px-4 py-3 font-mono text-body">
                <code>{code}</code>
              </pre>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Footer() {
  const items = [
    { label: "Components", href: links.showcase },
    { label: "Studio", href: links.studio },
    { label: "Storybook", href: links.storybook },
    { label: "GitHub", href: links.github },
    { label: "npm", href: links.npm },
  ]
  return (
    <footer
      data-theme="glaze"
      className="poster overflow-hidden bg-background text-foreground"
    >
      <div
        className={`${container} flex flex-wrap items-center gap-x-6 gap-y-3 pt-12 text-title`}
      >
        <span className="me-auto text-muted-foreground">MIT License</span>
        {items.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-item font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {label}
          </a>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={`${container} font-brand -mb-[0.16em] pt-6 text-[length:clamp(7rem,31vw,27rem)] leading-none select-none`}
      >
        glaze
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh overflow-x-clip bg-background text-foreground">
      <Goo />
      <Hero />
      <main>
        <FlavourSection />
        <Wall />
        <Studio />
        <Inside />
        <Start />
      </main>
      <Footer />
    </div>
  )
}
