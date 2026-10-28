import { Button } from "@amit-kap/glaze/components/button"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"

/** A sign-in page: one card on a quiet page. */
export function Login() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto bg-muted/40 p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
          A
        </div>
        <span className="text-body font-medium">Acme Inc.</span>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-title">Welcome back</CardTitle>
          <CardDescription>Sign in to your Acme workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <FieldSeparator>or</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input id="login-email" type="email" placeholder="you@acme.co" />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Button variant="link" size="sm" className="h-auto px-0">
                  Forgot it?
                </Button>
              </div>
              <Input
                id="login-password"
                type="password"
                defaultValue="hunter2hunter2"
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="login-remember" defaultChecked />
              <FieldLabel htmlFor="login-remember" className="font-normal">
                Keep me signed in
              </FieldLabel>
            </Field>
            <Button className="w-full">Sign in</Button>
          </FieldGroup>
        </CardContent>
      </Card>

      <p className="text-caption text-muted-foreground">
        New to Acme?{" "}
        <Button variant="link" size="sm" className="h-auto px-0">
          Create an account
        </Button>
      </p>
    </div>
  )
}
