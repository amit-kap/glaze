import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  DirectionProvider,
  useDirection,
} from "@amit-kap/glaze/components/direction"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"

// Stories follow the upstream shadcn/ui (base-nova) Direction page, which
// previews the RTL login card:
// https://ui.shadcn.com/docs/components/base/direction
// Upstream switches language with its site's selector; `language` is a
// control here.

const translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
      loginWithGoogle: "Login with Google",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      loginWithGoogle: "تسجيل الدخول باستخدام Google",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "התחבר לחשבון שלך",
      description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
      signUp: "הירשם",
      email: "אימייל",
      emailPlaceholder: "m@example.com",
      password: "סיסמה",
      forgotPassword: "שכחת את הסיסמה?",
      login: "התחבר",
      loginWithGoogle: "התחבר עם Google",
    },
  },
} as const

type Language = keyof typeof translations

function LoginCard({ language }: { language: Language }) {
  const { dir, values: t } = translations[language]

  return (
    <DirectionProvider direction={dir}>
      <Card className="w-sm" dir={dir}>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
          <CardAction>
            <Button variant="link">{t.signUp}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-rtl">{t.email}</Label>
                <Input
                  id="email-rtl"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-rtl">{t.password}</Label>
                  <a
                    href="#"
                    className="ms-auto inline-block text-body underline-offset-4 hover:underline"
                  >
                    {t.forgotPassword}
                  </a>
                </div>
                <Input id="password-rtl" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            {t.login}
          </Button>
          <Button variant="outline" className="w-full">
            {t.loginWithGoogle}
          </Button>
        </CardFooter>
      </Card>
    </DirectionProvider>
  )
}

const meta = {
  title: "Components/Direction",
  component: LoginCard,
  parameters: {
    docs: {
      description: {
        component:
          "`DirectionProvider` sets the text direction (`ltr` or `rtl`) for the Base UI components below it; also set `dir` on the matching element. Read it with `useDirection`.",
      },
    },
  },
  args: { language: "ar" },
  argTypes: {
    language: {
      control: "inline-radio",
      options: ["en", "ar", "he"],
      description: "Arabic and Hebrew render right-to-left.",
    },
  },
} satisfies Meta<typeof LoginCard>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

export const Hebrew: Story = { args: { language: "he" } }

export const English: Story = { args: { language: "en" } }

// --- Compositions ---------------------------------------------------------

function CurrentDirection() {
  const direction = useDirection()
  return <div>Current direction: {direction}</div>
}

// `useDirection` reads the nearest provider's direction.
export const UseDirection: Story = {
  render: () => (
    <div className="grid gap-2 text-body">
      <DirectionProvider direction="ltr">
        <CurrentDirection />
      </DirectionProvider>
      <DirectionProvider direction="rtl">
        <div dir="rtl">
          <CurrentDirection />
        </div>
      </DirectionProvider>
    </div>
  ),
}
