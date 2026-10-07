import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amitka/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amitka/glaze/components/card"
import { Input } from "@amitka/glaze/components/input"
import { Label } from "@amitka/glaze/components/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amitka/glaze/components/tabs"

type Variant = "default" | "line"

function TabsDemo({ variant = "default" }: { variant?: Variant }) {
  return (
    <Tabs defaultValue="account" className="w-sm">
      <TabsList variant={variant}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor={`tabs-name-${variant}`}>Name</Label>
            <Input id={`tabs-name-${variant}`} defaultValue="Pedro Duarte" />
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor={`tabs-pw-${variant}`}>New password</Label>
            <Input id={`tabs-pw-${variant}`} type="password" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

const meta = {
  title: "Components/Tabs",
  component: TabsList,
  subcomponents: { Tabs, TabsContent, TabsTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "A set of layered sections of content — known as tab panels — that are displayed one at a time.",
      },
    },
  },
  argTypes: { variant: { control: "radio", options: ["default", "line"] } },
  render: (args) => <TabsDemo variant={args.variant ?? "default"} />,
} satisfies Meta<typeof TabsList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { variant: "default" } }
export const Line: Story = { args: { variant: "line" } }
