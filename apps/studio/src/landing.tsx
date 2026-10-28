import {
  ArrowRightIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"

const features: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <BarChart3Icon />,
    title: "See it all at once",
    text: "Revenue, orders and refunds on one screen, refreshed as they happen.",
  },
  {
    icon: <ZapIcon />,
    title: "Fast by default",
    text: "Every view loads in a blink, so checking in never gets in the way.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Safe with your data",
    text: "Roles, audit trails and encryption come with every plan.",
  },
]

/** A marketing page: nav, hero, three features and a closing call to action. */
export function Landing() {
  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <header className="flex items-center gap-2.5 px-6 py-4">
        <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
          A
        </div>
        <span className="text-body font-medium">Acme</span>
        <nav
          aria-label="Site"
          className="ms-auto hidden items-center gap-1 @min-[600px]:flex"
        >
          <Button variant="ghost" size="sm">
            Product
          </Button>
          <Button variant="ghost" size="sm">
            Pricing
          </Button>
          <Button variant="ghost" size="sm">
            Docs
          </Button>
        </nav>
        <Button size="sm" className="ms-auto @min-[600px]:ms-2">
          Sign in
        </Button>
      </header>

      <section className="flex flex-col items-center gap-5 px-6 py-14 text-center">
        <Badge variant="secondary">New: weekly digests</Badge>
        <h2 className="max-w-xl text-display font-medium text-balance">
          Run your shop without the spreadsheet
        </h2>
        <p className="max-w-md text-body text-balance text-muted-foreground">
          Acme brings orders, customers and revenue together, so the day starts
          with answers instead of tabs.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="lg">
            Start free
            <ArrowRightIcon />
          </Button>
          <Button size="lg" variant="outline">
            Book a demo
          </Button>
        </div>
      </section>

      <section className="grid gap-3 px-6 pb-12 @min-[600px]:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="mb-1 flex size-8 items-center justify-center rounded-control bg-muted text-foreground [&_svg]:size-4">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mx-6 mb-10 flex flex-col items-center gap-3 rounded-lg bg-muted px-6 py-10 text-center">
        <h3 className="text-title font-medium">Ready when you are</h3>
        <p className="text-caption text-muted-foreground">
          Free for your first 100 orders. No card needed.
        </p>
        <Button>Create your account</Button>
      </section>
    </div>
  )
}
