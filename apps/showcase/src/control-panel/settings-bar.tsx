import {
  MoonIcon,
  Rows3Icon,
  Rows4Icon,
  SlidersHorizontalIcon,
  SunIcon,
} from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { Tabs, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"
import type { Density, Mode } from "@amit-kap/glaze/theme"

import { GitHubIcon, NpmIcon } from "./brand-icons"

// The settings bar floating at the bottom of the page: brand, links, the
// light/dark and density switches, and the button that opens the Customize
// sidebar.
export function SettingsBar({
  customized,
  open,
  onOpenChange,
  mode,
  onModeChange,
  density,
  onDensityChange,
}: {
  customized: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The resolved mode, never "system": the switch always shows a side. */
  mode: "light" | "dark"
  onModeChange: (mode: Mode) => void
  density: Density
  onDensityChange: (density: Density) => void
}) {
  return (
    <div
      role="toolbar"
      aria-label="Theme settings"
      className={`fixed inset-x-3 bottom-6 z-40 mx-auto flex w-fit items-center gap-1.5 rounded-container border bg-popover p-4 text-popover-foreground shadow-floating motion-reduce:transition-none sm:gap-4 lg:transition-[right] lg:duration-(--duration-moderate) lg:ease-standard [html[data-panel-dragging]_&]:transition-none ${open ? "lg:inset-e-[calc(var(--panel-w,420px)+--spacing(3))]" : ""}`}
    >
      <span className="flex items-center gap-0.5">
        <span className="me-1.5 font-heading text-title font-medium max-sm:me-0.5 max-sm:text-body">
          Glaze
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Glaze on npm"
          className="max-sm:hidden"
          nativeButton={false}
          render={<a href="https://www.npmjs.com/package/@amit-kap/glaze" />}
        >
          <NpmIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Glaze on GitHub"
          className="max-sm:hidden"
          nativeButton={false}
          render={<a href="https://github.com/amit-kap/glaze" />}
        >
          <GitHubIcon />
        </Button>
      </span>
      <span className="ms-auto flex items-center gap-1.5">
        <Tabs value={mode} onValueChange={(v) => v && onModeChange(v as Mode)}>
          <TabsList aria-label="Mode">
            <TabsTrigger value="light">
              <SunIcon />
              <span className="max-sm:sr-only">Light</span>
            </TabsTrigger>
            <TabsTrigger value="dark">
              <MoonIcon />
              <span className="max-sm:sr-only">Dark</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          value={density}
          onValueChange={(v) => v && onDensityChange(v as Density)}
        >
          <TabsList aria-label="Density">
            <TabsTrigger value="comfortable">
              <Rows3Icon />
              <span className="max-sm:sr-only">Comfortable</span>
            </TabsTrigger>
            <TabsTrigger value="compact">
              <Rows4Icon />
              <span className="max-sm:sr-only">Compact</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </span>
      <Button
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-controls="customize-sidebar"
        onClick={() => onOpenChange(!open)}
      >
        <SlidersHorizontalIcon />
        <span className="max-sm:sr-only">Customize</span>
        {customized && <Badge variant="secondary">Custom</Badge>}
      </Button>
    </div>
  )
}
