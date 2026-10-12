import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GlobeIcon } from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@amit-kap/glaze/components/combobox"
import { InputGroupAddon } from "@amit-kap/glaze/components/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@amit-kap/glaze/components/item"

// Stories follow the upstream shadcn/ui (base-nova) Combobox examples:
// https://ui.shadcn.com/docs/components/base/combobox
const meta = {
  title: "Components/Combobox",
  component: ComboboxInput,
  subcomponents: {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxTrigger,
    ComboboxValue,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Autocomplete input with a list of suggestions, for single or multiple (chips) selection. `Combobox` re-exports the Base UI root unchanged, so its props are documented at https://base-ui.com/react/components/combobox.",
      },
    },
  },
  args: { placeholder: "Select a framework" },
  argTypes: {
    showClear: { control: "boolean" },
    showTrigger: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ComboboxInput>

export default meta
type Story = StoryObj<typeof meta>

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
] as const

const countries = [
  { code: "", value: "", continent: "", label: "Select country" },
  {
    code: "ar",
    value: "argentina",
    label: "Argentina",
    continent: "South America",
  },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  {
    code: "co",
    value: "colombia",
    label: "Colombia",
    continent: "South America",
  },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  {
    code: "nz",
    value: "new-zealand",
    label: "New Zealand",
    continent: "Oceania",
  },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  {
    code: "za",
    value: "south-africa",
    label: "South Africa",
    continent: "Africa",
  },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  {
    code: "gb",
    value: "united-kingdom",
    label: "United Kingdom",
    continent: "Europe",
  },
  {
    code: "us",
    value: "united-states",
    label: "United States",
    continent: "North America",
  },
]

type Country = (typeof countries)[number]

// The popup a plain string-item combobox needs: an empty message and a list
// that renders each item as itself.
function StringList({
  empty = "No items found.",
  anchor,
}: {
  empty?: string
  anchor?: React.RefObject<HTMLElement | null>
}) {
  return (
    <ComboboxContent anchor={anchor}>
      <ComboboxEmpty>{empty}</ComboboxEmpty>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Combobox items={frameworks}>
      <ComboboxInput {...args} />
      <StringList />
    </Combobox>
  ),
}

// --- Variants -------------------------------------------------------------

export const Multiple: Story = {
  render: function Render() {
    const anchor = useComboboxAnchor()

    return (
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0]]}
      >
        <ComboboxChips ref={anchor} className="w-xs">
          <ComboboxValue>
            {(values: string[]) => (
              <React.Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput aria-label="Frameworks" />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <StringList anchor={anchor} />
      </Combobox>
    )
  },
}

// Use `showClear` to render a clear button once a value is selected.
export const ClearButton: Story = {
  render: () => (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxInput placeholder="Select a framework" showClear />
      <StringList />
    </Combobox>
  ),
}

// Use `autoHighlight` to highlight the first matching item while filtering.
export const AutoHighlight: Story = {
  render: () => (
    <Combobox items={frameworks} autoHighlight>
      <ComboboxInput placeholder="Select a framework" />
      <StringList />
    </Combobox>
  ),
}

// A button trigger with the search input inside the popup, like a select.
export const Popup: Story = {
  render: () => (
    <Combobox items={countries} defaultValue={countries[0]}>
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            className="w-64 justify-between font-normal"
          />
        }
      >
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder="Search" />
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Country) => (
            <ComboboxItem key={item.code} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Select a framework" disabled />
      <StringList />
    </Combobox>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Select a framework" aria-invalid="true" />
      <StringList />
    </Combobox>
  ),
}

// --- Compositions ---------------------------------------------------------

// Both grouped stories render timezones the same way; `separated` draws a
// divider between groups.
const timezoneGroup =
  (separated: boolean) =>
  (group: (typeof timezones)[number], index: number) => (
    <ComboboxGroup key={group.value} items={group.items}>
      <ComboboxLabel>{group.value}</ComboboxLabel>
      <ComboboxCollection>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxCollection>
      {separated && index < timezones.length - 1 && <ComboboxSeparator />}
    </ComboboxGroup>
  )

export const WithGroups: Story = {
  render: () => (
    <Combobox items={timezones}>
      <ComboboxInput placeholder="Select a timezone" />
      <ComboboxContent>
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>{timezoneGroup(true)}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

// Render any content inside ComboboxItem; `itemToStringValue` maps objects to
// the text used for filtering and the input value.
export const WithCustomItems: Story = {
  render: () => (
    <Combobox
      items={countries.filter((country) => country.code !== "")}
      itemToStringValue={(country: Country) => country.label}
    >
      <ComboboxInput placeholder="Search countries..." />
      <ComboboxContent>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(country: Country) => (
            <ComboboxItem key={country.code} value={country}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {country.label}
                  </ItemTitle>
                  <ItemDescription>
                    {country.continent} ({country.code})
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}

// ComboboxInput renders an InputGroup, so addons can be passed as children.
export const WithInputGroup: Story = {
  render: () => (
    <Combobox items={timezones}>
      <ComboboxInput placeholder="Select a timezone">
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent alignOffset={-28} className="w-60">
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>{timezoneGroup(false)}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
}
