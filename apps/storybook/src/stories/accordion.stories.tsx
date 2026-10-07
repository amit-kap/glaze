import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@amit-kap/glaze/components/accordion"

const items = [
  {
    value: "shipping",
    title: "What are your shipping options?",
    body: "We offer standard (5–7 days), express (2–3 days), and overnight shipping.",
  },
  {
    value: "returns",
    title: "What is your return policy?",
    body: "Returns are accepted within 30 days of purchase with the original receipt.",
  },
  {
    value: "support",
    title: "How can I contact support?",
    body: "Reach us by email or live chat, 24/7.",
  },
]

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  subcomponents: { AccordionContent, AccordionItem, AccordionTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings that each reveal a section of content.",
      },
    },
  },
  args: { defaultValue: ["shipping"] },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Multiple: Story = {
  ...Default,
  args: { multiple: true, defaultValue: ["shipping", "returns"] },
}
