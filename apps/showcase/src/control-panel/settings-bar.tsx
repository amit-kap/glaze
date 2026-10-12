import { SlidersHorizontalIcon } from "lucide-react"

import type { Mode } from "@amit-kap/glaze/theme"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { FieldLabel } from "@amit-kap/glaze/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

import { GitHubIcon, NpmIcon } from "./brand-icons"
import { isBaseTheme, type BaseTheme } from "../theme-builder"

const themes = [
  { value: "nova", label: "Nova (default)" },
  { value: "vega", label: "Vega" },
  { value: "maia", label: "Maia" },
  { value: "lyra", label: "Lyra" },
  { value: "mira", label: "Mira" },
  { value: "luma", label: "Luma" },
  { value: "sera", label: "Sera" },
  { value: "rhea", label: "Rhea" },
  { value: "gr8r", label: "Gr8r" },
]

const modes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

// Theme and Mode in the bar: the label shows from sm up.
function BarSelect({
  className,
  id,
  label,
  items,
  value,
  onChange,
}: {
  className?: string
  id: string
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <FieldLabel
        htmlFor={id}
        className="text-body text-muted-foreground max-sm:sr-only"
      >
        {label}
      </FieldLabel>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v as string)}
      >
        <SelectTrigger id={id} size="sm" className="w-36 max-sm:w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

// The settings bar floating at the bottom of the page: brand links, theme and
// mode selects, and the button that opens the Customize sidebar.
export function SettingsBar({
  base,
  mode,
  customized,
  open,
  onBaseChange,
  onModeChange,
  onOpenChange,
}: {
  base: BaseTheme
  mode: Mode
  customized: boolean
  open: boolean
  onBaseChange: (base: BaseTheme) => void
  onModeChange: (mode: Mode) => void
  onOpenChange: (open: boolean) => void
}) {
  return (
    <div
      role="toolbar"
      aria-label="Theme settings"
      className={`fixed inset-x-3 bottom-6 z-40 mx-auto flex max-w-2xl items-center gap-1.5 rounded-container border bg-popover p-4 text-popover-foreground shadow-floating motion-reduce:transition-none sm:gap-4 lg:transition-[right] lg:duration-(--duration-moderate) lg:ease-standard ${open ? "lg:inset-e-[calc(--spacing(80)+--spacing(3))]" : ""}`}
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
      <BarSelect
        className="max-sm:flex-3"
        id="panel-theme"
        label="Theme"
        items={themes}
        value={base}
        onChange={(v) => isBaseTheme(v) && onBaseChange(v)}
      />
      <BarSelect
        className="max-sm:flex-2"
        id="panel-mode"
        label="Mode"
        items={modes}
        value={mode}
        onChange={(v) => onModeChange(v as Mode)}
      />
      <Button
        variant="outline"
        size="sm"
        className="ms-auto"
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
