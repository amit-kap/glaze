import { SearchIcon } from "lucide-react"

import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { ColorPicker } from "@amit-kap/glaze/components/color-picker"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import { Label } from "@amit-kap/glaze/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@amit-kap/glaze/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Switch } from "@amit-kap/glaze/components/switch"
import { Textarea } from "@amit-kap/glaze/components/textarea"

import { Stack } from "./layout"

// Stories: Default, Disabled, Invalid.
export function InputDemo() {
  return (
    <Stack>
      <Input placeholder="Enter text" aria-label="Text" />
      <Field data-disabled>
        <FieldLabel htmlFor="input-disabled">Email</FieldLabel>
        <Input id="input-disabled" type="email" placeholder="Email" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
        <Input id="input-invalid" placeholder="Error" aria-invalid />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
    </Stack>
  )
}

// Story: Default.
export function TextareaDemo() {
  return (
    <Stack>
      <Textarea placeholder="Type your message here." aria-label="Message" />
    </Stack>
  )
}

// Stories: Default, With Text.
export function InputGroupDemo() {
  return (
    <Stack>
      <InputGroup>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" aria-label="Amount" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="example.com"
          className="ps-0.5!"
          aria-label="Website"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Enter your message"
          aria-label="Message"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground">
            120 characters left
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Stack>
  )
}

// Story: With Group.
export function CheckboxDemo() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">
        Show these items on the desktop:
      </FieldLegend>
      <FieldDescription>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <FieldGroup className="gap-3">
        {[
          { id: "hard-disks", label: "Hard disks", checked: true },
          { id: "external-disks", label: "External disks", checked: true },
          { id: "cds-dvds", label: "CDs, DVDs, and iPods", checked: false },
          {
            id: "connected-servers",
            label: "Connected servers",
            checked: false,
          },
        ].map((item) => (
          <Field key={item.id} orientation="horizontal">
            <Checkbox
              id={item.id}
              name={item.id}
              defaultChecked={item.checked}
            />
            <FieldLabel htmlFor={item.id} className="font-normal">
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}

// Story: With Description.
export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {[
        {
          value: "default",
          label: "Default",
          description: "Standard spacing for most use cases.",
        },
        {
          value: "comfortable",
          label: "Comfortable",
          description: "More space between elements.",
        },
        {
          value: "compact",
          label: "Compact",
          description: "Minimal spacing for dense layouts.",
        },
      ].map((option) => (
        <Field key={option.value} orientation="horizontal">
          <RadioGroupItem value={option.value} id={`desc-${option.value}`} />
          <FieldContent>
            <FieldLabel htmlFor={`desc-${option.value}`}>
              {option.label}
            </FieldLabel>
            <FieldDescription>{option.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}

// Stories: With Label, Size.
export function SwitchDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      <FieldGroup className="w-40">
        <Field orientation="horizontal">
          <Switch id="switch-size-sm" size="sm" />
          <FieldLabel htmlFor="switch-size-sm">Small</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-size-default" size="default" />
          <FieldLabel htmlFor="switch-size-default">Default</FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  )
}

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
]
const vegetables = [
  { label: "Carrot", value: "carrot" },
  { label: "Leek", value: "leek" },
]

// Stories: Default, Small.
export function SelectDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Select items={[...fruits, ...vegetables]} defaultValue="banana">
        <SelectTrigger className="w-48" aria-label="Produce">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            {vegetables.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={fruits} defaultValue="apple">
        <SelectTrigger size="sm" className="w-40" aria-label="Fruit (small)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Stories: Default, Range, Disabled.
export function SliderDemo() {
  return (
    <Stack loose>
      <Slider defaultValue={[75]} max={100} step={1} aria-label="Volume" />
      <Slider defaultValue={[25, 50]} max={100} step={5} aria-label="Range" />
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        disabled
        aria-label="Volume"
      />
    </Stack>
  )
}

// Stories: Default, Swatches.
export function ColorPickerDemo() {
  return (
    <ColorPicker
      className="max-w-72"
      defaultValue="#6B97FF"
      swatches={[
        "#171717",
        "#E7000B",
        "#A65F00",
        "#008236",
        "#155DFC",
        "#6B97FF",
      ]}
    />
  )
}

// Stories: Default, Invalid.
export function FieldDemo() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="field-username">Username</FieldLabel>
        <Input id="field-username" type="text" placeholder="Max Leiter" />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="field-invalid">Invalid Input</FieldLabel>
        <Input id="field-invalid" placeholder="Error" aria-invalid />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
