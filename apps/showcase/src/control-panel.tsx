import { useTheme, type Density, type Mode } from "@amit-kap/glaze/theme"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Separator } from "@amit-kap/glaze/components/separator"

const themes = [
  { value: "nova", label: "Nova" },
  { value: "vega", label: "Vega" },
  { value: "maia", label: "Maia" },
  { value: "lyra", label: "Lyra" },
  { value: "mira", label: "Mira" },
  { value: "luma", label: "Luma" },
  { value: "sera", label: "Sera" },
  { value: "rhea", label: "Rhea" },
]

const modes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

const densities = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

function Row({
  id,
  label,
  items,
  value,
  onChange,
}: {
  id: string
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-body text-muted-foreground">
        {label}
      </label>
      <Select items={items} value={value} onValueChange={(v) => v && onChange(v as string)}>
        <SelectTrigger id={id} size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Floating settings panel, top right on wide screens, above the column otherwise.
export function ControlPanel() {
  const { theme, setTheme, mode, setMode, density, setDensity } = useTheme()

  return (
    <aside
      aria-label="Theme settings"
      className="z-40 flex w-full flex-col gap-3 rounded-container border bg-popover p-4 text-popover-foreground shadow-floating xl:fixed xl:top-4 xl:right-4 xl:w-72"
    >
      <div className="flex items-center gap-2 font-heading text-body font-strong">
        <span className="size-3.5 rounded-item-sm bg-primary" aria-hidden />
        Glaze
      </div>
      <Row id="panel-theme" label="Theme" items={themes} value={theme} onChange={setTheme} />
      <Row id="panel-mode" label="Mode" items={modes} value={mode} onChange={(v) => setMode(v as Mode)} />
      <Row
        id="panel-density"
        label="Density"
        items={densities}
        value={density}
        onChange={(v) => setDensity(v as Density)}
      />
      <Separator />
      <div className="flex flex-col gap-1 text-caption text-muted-foreground">
        <code className="truncate font-mono" title="npm i @amit-kap/glaze">npm i @amit-kap/glaze</code>
        <div className="-ml-2 flex">
          <Button
            variant="link"
            size="xs"
            nativeButton={false}
            render={<a href="https://www.npmjs.com/package/@amit-kap/glaze" />}
          >
            npm
          </Button>
          <Button variant="link" size="xs" nativeButton={false} render={<a href="https://github.com/amit-kap/glaze" />}>
            GitHub
          </Button>
        </div>
      </div>
    </aside>
  )
}
