import { useTheme, type Density, type Mode } from "@amit-kap/glaze/theme"
import { Label } from "@amit-kap/glaze/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { ToggleGroup, ToggleGroupItem } from "@amit-kap/glaze/components/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@amit-kap/glaze/components/tooltip"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

export const themes = [
  { value: "nova", label: "Nova", note: "Geist · the default" },
  { value: "vega", label: "Vega", note: "Inter · classic" },
  { value: "maia", label: "Maia", note: "Figtree · soft and round" },
  { value: "lyra", label: "Lyra", note: "JetBrains Mono · boxy" },
  { value: "mira", label: "Mira", note: "Inter · dense" },
  { value: "luma", label: "Luma", note: "Inter · rounded, lifted" },
  { value: "sera", label: "Sera", note: "Playfair · editorial" },
  { value: "rhea", label: "Rhea", note: "Inter · friendly" },
]

const modes: { value: Mode; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

export function ControlPanel() {
  const { theme, setTheme, mode, setMode, density, setDensity } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Label className="sr-only" htmlFor="theme-select">
        Theme
      </Label>
      <Select
        items={themes}
        value={theme}
        onValueChange={(value) => value && setTheme(value as string)}
      >
        <SelectTrigger id="theme-select" size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-64">
          {themes.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
              <span className="ml-auto pl-3 text-caption text-muted-foreground">{t.note}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToggleGroup
        variant="outline"
        size="sm"
        aria-label="Mode"
        value={[mode]}
        onValueChange={(value) => value[0] && setMode(value[0] as Mode)}
      >
        {modes.map(({ value, label, icon: Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger render={<ToggleGroupItem value={value} aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>

      <ToggleGroup
        variant="outline"
        size="sm"
        aria-label="Density"
        value={[density]}
        onValueChange={(value) => value[0] && setDensity(value[0] as Density)}
      >
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
