import * as React from "react"
import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  ChevronRightIcon,
  FolderCodeIcon,
} from "lucide-react"

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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@amit-kap/glaze/components/carousel"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import { Input } from "@amit-kap/glaze/components/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import { Label } from "@amit-kap/glaze/components/label"

// Shared demo containers: a centered column of controls, or a wrapping row.
export const Stack = ({
  children,
  loose,
}: {
  children: React.ReactNode
  loose?: boolean
}) => (
  <div className={`flex w-full max-w-sm flex-col ${loose ? "gap-8" : "gap-4"}`}>
    {children}
  </div>
)

export const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {children}
  </div>
)

// Story: Default.
export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="card-email">Email</Label>
              <Input
                id="card-email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="card-password">Password</Label>
                <a
                  href="#"
                  className="ms-auto inline-block text-body underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="card-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}

// Story: Autoplay.
export function CarouselDemo() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (!api || paused) {
      return
    }
    const timer = window.setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 2000)
    return () => window.clearInterval(timer)
  }, [api, paused])

  return (
    <Carousel
      setApi={setApi}
      className="w-full max-w-xs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CarouselContent>
        {[0, 1, 2, 3, 4].map((index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-display font-strong">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

// Story: Default.
export function EmptyDemo() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
      <Button
        variant="link"
        render={<a href="#" />}
        className="text-muted-foreground"
        size="sm"
        nativeButton={false}
      >
        Learn More <ArrowUpRightIcon />
      </Button>
    </Empty>
  )
}

// Story: Variants.
export function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>
            A simple item with title and description.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" render={<a href="#" />}>
        <ItemMedia>
          <BadgeCheckIcon className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item>
    </div>
  )
}
