import * as React from "react"
import { ArrowUpRightIcon, MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@amit-kap/glaze/components/sidebar"
import { Toaster } from "@amit-kap/glaze/components/toast"
import { useTheme } from "@amit-kap/glaze/theme"
import { DemoTile, tiles } from "./tiles"
import { ComponentView } from "./variants/component-view"
import { components } from "./variants/registry"

const HOME_URL = import.meta.env.VITE_HOME_URL ?? "../"
const STUDIO_URL = import.meta.env.VITE_STUDIO_URL ?? "../studio/"

// Hash routes, so the static site needs no server rules: #/ is the overview,
// #/button is the Button page.
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback)
  return () => window.removeEventListener("hashchange", callback)
}

function useRoute() {
  const hash = React.useSyncExternalStore(subscribe, () => window.location.hash)
  const id = hash.replace(/^#\/?/, "").split("/")[0]
  return components.find((c) => c.id === id) ?? null
}

function ModeToggle() {
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setMode(dark ? "light" : "dark")}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

function AppSidebar({ activeId }: { activeId: string | null }) {
  const [query, setQuery] = React.useState("")
  const needle = query.trim().toLowerCase()
  const visible = components.filter((c) =>
    c.name.toLowerCase().includes(needle)
  )

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 p-3">
        <a
          href={HOME_URL}
          className="px-2 pt-1 text-heading font-strong text-sidebar-foreground"
        >
          Glaze
        </a>
        <SidebarInput
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter components"
          aria-label="Filter components"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu data-testid="component-nav">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeId === null}
                  render={
                    <a
                      href="#/"
                      aria-current={activeId === null ? "page" : undefined}
                      data-testid="nav-overview"
                    />
                  }
                >
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
              {visible.map(({ id, name }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    isActive={activeId === id}
                    render={
                      <a
                        href={`#/${id}`}
                        aria-current={activeId === id ? "page" : undefined}
                        data-testid="nav-item"
                        data-component={id}
                      />
                    }
                  >
                    {name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-row items-center justify-between p-3">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<a href={STUDIO_URL} target="_blank" rel="noreferrer" />}
        >
          Glaze Studio
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

function Overview() {
  return (
    <>
      <h1 className="sr-only">All components</h1>
      <div
        data-testid="overview-grid"
        className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {tiles.map(({ name, demo: Demo, wide }) => (
          <DemoTile key={name} name={name} wide={wide}>
            <Demo />
          </DemoTile>
        ))}
      </div>
    </>
  )
}

export function App() {
  const active = useRoute()

  React.useEffect(() => {
    document.title = active ? `${active.name} · Glaze` : "Glaze"
    window.scrollTo(0, 0)
  }, [active])

  return (
    <SidebarProvider>
      <AppSidebar activeId={active?.id ?? null} />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-sticky flex h-12 items-center gap-2 bg-background px-3 md:hidden">
          <SidebarTrigger />
          <span className="text-body font-strong">
            {active?.name ?? "All components"}
          </span>
        </header>
        <main className="px-3 py-6 sm:px-6 sm:py-8">
          {active ? <ComponentView entry={active} /> : <Overview />}
        </main>
      </SidebarInset>
      {/* The toast page mounts its own, so two never show each toast twice. */}
      {active?.id !== "toast" && <Toaster />}
    </SidebarProvider>
  )
}
