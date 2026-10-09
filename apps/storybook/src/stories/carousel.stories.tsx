import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card, CardContent } from "@amit-kap/glaze/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@amit-kap/glaze/components/carousel"
import { cn } from "@amit-kap/glaze/lib/utils"

// Stories follow the upstream shadcn/ui (base-nova) Carousel examples:
// https://ui.shadcn.com/docs/components/base/carousel
const meta = {
  title: "Components/Carousel",
  component: Carousel,
  subcomponents: {
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A carousel with motion and swipe built using [Embla](https://www.embla-carousel.com). Pass Embla options through `opts`, plugins through `plugins`, and read the API with `setApi`.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

function Slide({
  index,
  className,
  textClassName = "text-display",
}: {
  index: number
  className?: string
  textClassName?: string
}) {
  return (
    <div className="p-1">
      <Card>
        <CardContent
          className={cn("flex items-center justify-center p-6", className)}
        >
          <span className={cn("font-semibold", textClassName)}>
            {index + 1}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

const slides = Array.from({ length: 5 }, (_, index) => index)

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Carousel className="w-xs" {...args}>
      <CarouselContent>
        {slides.map((index) => (
          <CarouselItem key={index}>
            <Slide index={index} className="aspect-square" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

// --- Variants -------------------------------------------------------------

// Use `basis-*` on `CarouselItem` to show several slides at once.
export const Sizes: Story = {
  render: () => (
    <Carousel opts={{ align: "start" }} className="w-sm">
      <CarouselContent>
        {slides.map((index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <Slide
              index={index}
              className="aspect-square"
              textClassName="text-heading"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

// Set the gap with `pl-*` on items and a matching `-ml-*` on the content.
export const Spacing: Story = {
  render: () => (
    <Carousel className="w-sm">
      <CarouselContent className="-ml-1">
        {slides.map((index) => (
          <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3">
            <Slide
              index={index}
              className="aspect-square"
              textClassName="text-heading"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Orientation: Story = {
  render: () => (
    <Carousel
      opts={{ align: "start" }}
      orientation="vertical"
      className="my-12 w-xs"
    >
      <CarouselContent className="-mt-1 h-[270px]">
        {slides.map((index) => (
          <CarouselItem key={index} className="basis-1/2 pt-1">
            <Slide index={index} textClassName="text-heading" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

// --- Compositions ---------------------------------------------------------

// `setApi` exposes the Embla API, e.g. to show the current slide.
export const Api: Story = {
  render: function Render() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      if (!api) {
        return
      }

      const onSelect = () => setCurrent(api.selectedScrollSnap() + 1)
      setCount(api.scrollSnapList().length)
      onSelect()
      api.on("select", onSelect)
      return () => {
        api.off("select", onSelect)
      }
    }, [api])

    return (
      <div className="w-xs">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {slides.map((index) => (
              <CarouselItem key={index}>
                <Card className="m-px">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-display font-semibold">
                      {index + 1}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-body text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
    )
  },
}

// Upstream uses the `embla-carousel-autoplay` plugin, which Glaze doesn't
// ship; this advances through the API every 2s and pauses on hover instead.
export const Autoplay: Story = {
  render: function Render() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [paused, setPaused] = React.useState(false)

    React.useEffect(() => {
      if (!api || paused) {
        return
      }

      const timer = window.setInterval(() => {
        if (api.canScrollNext()) api.scrollNext()
        else api.scrollTo(0)
      }, 2000)
      return () => window.clearInterval(timer)
    }, [api, paused])

    return (
      <Carousel
        setApi={setApi}
        className="w-xs"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <CarouselContent>
          {slides.map((index) => (
            <CarouselItem key={index}>
              <Slide index={index} className="aspect-square" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  },
}
