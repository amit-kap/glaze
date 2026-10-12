import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
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
import { Switch } from "@amit-kap/glaze/components/switch"

// Stories follow the upstream shadcn/ui (base-nova) Select examples:
// https://ui.shadcn.com/docs/components/base/select
const meta = {
  title: "Components/Select",
  component: SelectTrigger,
  subcomponents: {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectValue,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a list of options for the user to pick from — triggered by a button. Pass `items` to `Select` so `SelectValue` can show the selected label; an item with `value: null` acts as the placeholder. `Select` re-exports the Base UI root unchanged, so its props are documented at https://base-ui.com/react/components/select.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
  decorators: [
    (Story) => (
      <div className="w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectTrigger>

export default meta
type Story = StoryObj<typeof meta>

type Option = { label: string; value: string | null; disabled?: boolean }

// A labelled group of plain options — the shape every Select demo repeats.
function OptionGroup({ label, items }: { label?: string; items: Option[] }) {
  return (
    <SelectGroup>
      {label && <SelectLabel>{label}</SelectLabel>}
      {items.map((item) => (
        <SelectItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  )
}

const fruits: Option[] = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
]

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Select items={fruits}>
      <SelectTrigger {...args} aria-label="Fruit" className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <OptionGroup label="Fruits" items={fruits} />
      </SelectContent>
    </Select>
  ),
}

// --- Sizes ----------------------------------------------------------------

// Glaze-only: upstream supports `size="sm"` but has no example for it.
export const Small: Story = {
  args: { size: "sm" },
  render: Default.render,
}

// --- Behavior -------------------------------------------------------------

export const AlignItemWithTrigger: Story = {
  render: function Render() {
    const [alignItemWithTrigger, setAlignItemWithTrigger] = React.useState(true)

    return (
      <FieldGroup className="w-full max-w-xs">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="align-item">Align Item</FieldLabel>
            <FieldDescription>
              Toggle to align the item with the trigger.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="align-item"
            checked={alignItemWithTrigger}
            onCheckedChange={setAlignItemWithTrigger}
          />
        </Field>
        <Field>
          <Select items={fruits} defaultValue="banana">
            <SelectTrigger aria-label="Fruit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
              <OptionGroup items={fruits} />
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
    )
  },
}

const northAmerica = [
  { label: "Eastern Standard Time", value: "est" },
  { label: "Central Standard Time", value: "cst" },
  { label: "Mountain Standard Time", value: "mst" },
  { label: "Pacific Standard Time", value: "pst" },
  { label: "Alaska Standard Time", value: "akst" },
  { label: "Hawaii Standard Time", value: "hst" },
]

const europeAfrica = [
  { label: "Greenwich Mean Time", value: "gmt" },
  { label: "Central European Time", value: "cet" },
  { label: "Eastern European Time", value: "eet" },
  { label: "Western European Summer Time", value: "west" },
  { label: "Central Africa Time", value: "cat" },
  { label: "East Africa Time", value: "eat" },
]

const asia = [
  { label: "Moscow Time", value: "msk" },
  { label: "India Standard Time", value: "ist" },
  { label: "China Standard Time", value: "cst_china" },
  { label: "Japan Standard Time", value: "jst" },
  { label: "Korea Standard Time", value: "kst" },
  { label: "Indonesia Central Standard Time", value: "ist_indonesia" },
]

const australiaPacific = [
  { label: "Australian Western Standard Time", value: "awst" },
  { label: "Australian Central Standard Time", value: "acst" },
  { label: "Australian Eastern Standard Time", value: "aest" },
  { label: "New Zealand Standard Time", value: "nzst" },
  { label: "Fiji Time", value: "fjt" },
]

const southAmerica = [
  { label: "Argentina Time", value: "art" },
  { label: "Bolivia Time", value: "bot" },
  { label: "Brasilia Time", value: "brt" },
  { label: "Chile Standard Time", value: "clt" },
]

const timezones = [
  { label: "Select a timezone", value: null },
  ...northAmerica,
  ...europeAfrica,
  ...asia,
  ...australiaPacific,
  ...southAmerica,
]

const timezoneGroups: [string, Option[]][] = [
  ["North America", northAmerica],
  ["Europe & Africa", europeAfrica],
  ["Asia", asia],
  ["Australia & Pacific", australiaPacific],
  ["South America", southAmerica],
]

export const Scrollable: Story = {
  render: () => (
    <Select items={timezones}>
      <SelectTrigger aria-label="Timezone" className="w-full max-w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {timezoneGroups.map(([label, items]) => (
          <OptionGroup key={label} label={label} items={items} />
        ))}
      </SelectContent>
    </Select>
  ),
}

// --- States ---------------------------------------------------------------

// Same fruits, one option disabled.
const disabledFruits: Option[] = fruits.map((item) =>
  item.value === "grapes" ? { ...item, disabled: true } : item
)

export const Disabled: Story = {
  render: () => (
    <Select items={disabledFruits} disabled>
      <SelectTrigger aria-label="Fruit" className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <OptionGroup items={disabledFruits} />
      </SelectContent>
    </Select>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid className="w-full max-w-48">
      <FieldLabel htmlFor="select-invalid">Fruit</FieldLabel>
      <Select items={fruits.slice(0, 4)}>
        <SelectTrigger id="select-invalid" aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <OptionGroup items={fruits.slice(0, 4)} />
        </SelectContent>
      </Select>
      <FieldDescription>Please select a fruit.</FieldDescription>
    </Field>
  ),
}

// --- Compositions ---------------------------------------------------------

const groupFruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
]
const vegetables = [
  { label: "Carrot", value: "carrot" },
  { label: "Broccoli", value: "broccoli" },
  { label: "Spinach", value: "spinach" },
]

export const WithGroups: Story = {
  render: () => (
    <Select
      items={[
        { label: "Select a fruit", value: null },
        ...groupFruits,
        ...vegetables,
      ]}
    >
      <SelectTrigger aria-label="Food" className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <OptionGroup label="Fruits" items={groupFruits} />
        <SelectSeparator />
        <OptionGroup label="Vegetables" items={vegetables} />
      </SelectContent>
    </Select>
  ),
}
