import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { useTheme, type Density, type Mode } from "@amit-kap/glaze/theme"
import { Button } from "@amit-kap/glaze/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@amit-kap/glaze/components/card"
import { Field, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

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

const install = "npm i @amit-kap/glaze"

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
    <Field orientation="horizontal">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
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
    </Field>
  )
}

// Settings panel, built only from Glaze components. Floats top right on wide
// screens and sits above the column otherwise.
export function ControlPanel() {
  const { theme, setTheme, mode, setMode, density, setDensity } = useTheme()
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(install)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked: the command stays selectable in the field.
    }
  }

  return (
    <Card size="sm" aria-label="Theme settings" className="z-40 w-full xl:fixed xl:top-4 xl:right-4 xl:w-72">
      <CardHeader>
        <CardTitle>Glaze</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Row id="panel-theme" label="Theme" items={themes} value={theme} onChange={setTheme} />
          <Row id="panel-mode" label="Mode" items={modes} value={mode} onChange={(v) => setMode(v as Mode)} />
          <Row
            id="panel-density"
            label="Density"
            items={densities}
            value={density}
            onChange={(v) => setDensity(v as Density)}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <InputGroup>
          <InputGroupInput readOnly value={install} aria-label="Install command" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy install command" onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div className="flex">
          <Button
            variant="link"
            size="sm"
            nativeButton={false}
            render={<a href="https://www.npmjs.com/package/@amit-kap/glaze" />}
          >
            npm
          </Button>
          <Button variant="link" size="sm" nativeButton={false} render={<a href="https://github.com/amit-kap/glaze" />}>
            GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
