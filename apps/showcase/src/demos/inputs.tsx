import {
  BotIcon,
  EyeIcon,
  MoonIcon,
  PencilIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { IconSwitch } from "@amit-kap/glaze/components/icon-switch"
import { ColorPicker } from "@amit-kap/glaze/components/color-picker"
import {
  Field,
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
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Switch } from "@amit-kap/glaze/components/switch"
import { Textarea } from "@amit-kap/glaze/components/textarea"

import { Row, Stack } from "./layout"

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
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldDescription>
      <RadioGroup defaultValue="monthly">
        {[
          ["monthly", "Monthly ($9.99/month)"],
          ["yearly", "Yearly ($99.99/year)"],
          ["lifetime", "Lifetime ($299.99)"],
        ].map(([value, label]) => (
          <Field key={value} orientation="horizontal">
            <RadioGroupItem value={value} id={`plan-${value}`} />
            <FieldLabel htmlFor={`plan-${value}`} className="font-normal">
              {label}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}

// Stories: Default, Sizes, Controlled, Pairs.
export function IconSwitchDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Row>
        <IconSwitch
          icon={<UserIcon />}
          checkedIcon={<BotIcon />}
          aria-label="Switch between human and agent mode"
        />
        <IconSwitch
          icon={<SunIcon />}
          checkedIcon={<MoonIcon />}
          defaultChecked
          aria-label="Toggle color mode"
        />
        <IconSwitch
          icon={<EyeIcon />}
          checkedIcon={<PencilIcon />}
          aria-label="Switch between preview and edit"
        />
      </Row>
      <Row>
        <IconSwitch
          size="sm"
          icon={<SunIcon />}
          checkedIcon={<MoonIcon />}
          aria-label="Toggle color mode"
        />
        <IconSwitch
          size="sm"
          icon={<UserIcon />}
          checkedIcon={<BotIcon />}
          aria-label="Switch between human and agent mode"
        />
      </Row>
    </div>
  )
}

// Stories: With Label, Size.
export function SwitchDemo() {
  return (
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
  )
}

const timezoneGroups = [
  {
    label: "North America",
    items: [
      { label: "Eastern Standard Time", value: "est" },
      { label: "Central Standard Time", value: "cst" },
      { label: "Mountain Standard Time", value: "mst" },
      { label: "Pacific Standard Time", value: "pst" },
      { label: "Alaska Standard Time", value: "akst" },
      { label: "Hawaii Standard Time", value: "hst" },
    ],
  },
  {
    label: "Europe & Africa",
    items: [
      { label: "Greenwich Mean Time", value: "gmt" },
      { label: "Central European Time", value: "cet" },
      { label: "Eastern European Time", value: "eet" },
      { label: "Western European Summer Time", value: "west" },
      { label: "Central Africa Time", value: "cat" },
      { label: "East Africa Time", value: "eat" },
    ],
  },
  {
    label: "Asia",
    items: [
      { label: "Moscow Time", value: "msk" },
      { label: "India Standard Time", value: "ist" },
      { label: "China Standard Time", value: "cst_china" },
      { label: "Japan Standard Time", value: "jst" },
      { label: "Korea Standard Time", value: "kst" },
      { label: "Indonesia Central Standard Time", value: "ist_indonesia" },
    ],
  },
  {
    label: "Australia & Pacific",
    items: [
      { label: "Australian Western Standard Time", value: "awst" },
      { label: "Australian Central Standard Time", value: "acst" },
      { label: "Australian Eastern Standard Time", value: "aest" },
      { label: "New Zealand Standard Time", value: "nzst" },
      { label: "Fiji Time", value: "fjt" },
    ],
  },
  {
    label: "South America",
    items: [
      { label: "Argentina Time", value: "art" },
      { label: "Bolivia Time", value: "bot" },
      { label: "Brasilia Time", value: "brt" },
      { label: "Chile Standard Time", value: "clt" },
    ],
  },
]

const timezones = [
  { label: "Select a timezone", value: null },
  ...timezoneGroups.flatMap((group) => group.items),
]

// Stories: Default, Small.
export function SelectDemo() {
  return (
    <Select items={timezones}>
      <SelectTrigger aria-label="Timezone" className="w-full max-w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {timezoneGroups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

// Stories: Default, Range, Disabled.
export function SliderDemo() {
  return (
    <Stack loose>
      <Slider defaultValue={[75]} max={100} step={1} aria-label="Volume" />
      <Slider defaultValue={[25, 50]} max={100} step={5} aria-label="Range" />
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
