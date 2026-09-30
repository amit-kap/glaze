import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@workspace/ui/components/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro", "Vite"]

function ComboboxDemo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput
        placeholder="Select a framework"
        className="w-60"
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxMultipleDemo() {
  const anchor = useComboboxAnchor()

  return (
    <Combobox items={frameworks} multiple defaultValue={["Next.js", "Astro"]}>
      <ComboboxChips ref={anchor} className="w-80">
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Add framework" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const meta = {
  title: "Components/Combobox",
  component: ComboboxInput,
  subcomponents: {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
  },
  parameters: {
    docs: {
      description: {
        component:
          "An input combined with a list of suggestions, with single or multiple (chips) selection. `Combobox` re-exports the Base UI root unchanged, so its props are documented at https://base-ui.com/react/components/combobox.",
      },
    },
  },
} satisfies Meta<typeof ComboboxInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <ComboboxDemo /> }
export const Multiple: Story = { render: () => <ComboboxMultipleDemo /> }
