import type { Meta, StoryObj } from "@storybook/react-vite"
import { AppWindowIcon, CodeIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"

// Stories follow the upstream shadcn/ui (base-nova) Tabs examples:
// https://ui.shadcn.com/docs/components/base/tabs
const meta = {
  title: "Components/Tabs",
  component: Tabs,
  subcomponents: { TabsContent, TabsList, TabsTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time. Set `variant` on `TabsList` and `orientation` on `Tabs`.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

const panels = [
  {
    value: "overview",
    title: "Overview",
    description:
      "View your key metrics and recent project activity. Track progress across all your active projects.",
    content: "You have 12 active projects and 3 pending tasks.",
  },
  {
    value: "analytics",
    title: "Analytics",
    description:
      "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
    content: "Page views are up 25% compared to last month.",
  },
  {
    value: "reports",
    title: "Reports",
    description:
      "Generate and download your detailed reports. Export data in multiple formats for analysis.",
    content: "You have 5 reports ready and available to export.",
  },
  {
    value: "settings",
    title: "Settings",
    description:
      "Manage your account preferences and options. Customize your experience to fit your needs.",
    content: "Configure notifications, security, and themes.",
  },
]

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" className="w-[400px]" {...args}>
      <TabsList>
        {panels.map((panel) => (
          <TabsTrigger key={panel.value} value={panel.value}>
            {panel.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          <Card>
            <CardHeader>
              <CardTitle>{panel.title}</CardTitle>
              <CardDescription>{panel.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-body text-muted-foreground">
              {panel.content}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  ),
}

// --- Variants -------------------------------------------------------------

// `variant="line"` swaps the pill background for an underline.
export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Icons: Story = {
  render: () => (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}
