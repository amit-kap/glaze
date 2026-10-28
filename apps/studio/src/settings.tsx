import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Switch } from "@amit-kap/glaze/components/switch"
import { Textarea } from "@amit-kap/glaze/components/textarea"

const zones = [
  { value: "pt", label: "Pacific Time (PT)" },
  { value: "et", label: "Eastern Time (ET)" },
  { value: "utc", label: "UTC" },
]

const notifications = [
  {
    id: "comments",
    title: "Comments",
    note: "When someone replies to you or mentions you.",
    on: true,
  },
  {
    id: "digest",
    title: "Weekly digest",
    note: "A Monday summary of orders and revenue.",
    on: true,
  },
  {
    id: "product",
    title: "Product updates",
    note: "New features and changes to your plan.",
    on: false,
  },
]

/** A settings page: a profile form and notification switches in cards. */
export function Settings() {
  return (
    <div className="h-full overflow-y-auto bg-muted/40 p-4 @min-[600px]:p-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div>
          <h2 className="text-title font-medium">Settings</h2>
          <p className="text-caption text-muted-foreground">
            Manage your profile and how Acme reaches you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is how you appear to your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change photo
                </Button>
              </div>
              <Field>
                <FieldLabel htmlFor="settings-name">Name</FieldLabel>
                <Input id="settings-name" defaultValue="Maya Chen" />
              </Field>
              <Field>
                <FieldLabel htmlFor="settings-email">Email</FieldLabel>
                <Input
                  id="settings-email"
                  type="email"
                  defaultValue="maya@acme.co"
                />
                <FieldDescription>
                  We send receipts and sign-in links here.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
                <Textarea
                  id="settings-bio"
                  defaultValue="Runs operations at Acme. Coffee first."
                />
              </Field>
              <Field>
                <FieldLabel>Time zone</FieldLabel>
                <Select items={zones} defaultValue="pt">
                  <SelectTrigger aria-label="Time zone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what lands in your inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {notifications.map((item) => (
                <Field key={item.id} orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={`settings-${item.id}`}>
                      {item.title}
                    </FieldLabel>
                    <FieldDescription>{item.note}</FieldDescription>
                  </FieldContent>
                  <Switch id={`settings-${item.id}`} defaultChecked={item.on} />
                </Field>
              ))}
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>
              Deleting your account removes your workspace for good.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="destructive">Delete account</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
