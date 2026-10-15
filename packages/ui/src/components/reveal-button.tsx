import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@amit-kap/glaze/lib/utils"

import { buttonVariants } from "@amit-kap/glaze/components/button"

// An icon button that opens sideways on hover or keyboard focus to reveal
// its label, then folds back to the square icon. The label lives in a grid
// column animating 0fr → 1fr — no measuring — and slides out from behind
// the icon as it opens. It stays in the DOM when collapsed, so it is the
// button's accessible name. `iconSide="end"` puts the icon last: the label
// reveals to its side and pushes it outward.
const sizes = {
  xs: {
    button:
      "h-control-xs min-w-control-xs rounded-(--button-radius-xs) px-1.5 text-caption [&_svg:not([class*='size-'])]:size-3",
    gap: 1,
  },
  sm: {
    button:
      "h-control-sm min-w-control-sm rounded-(--button-radius-sm) px-1.5 text-caption [&_svg:not([class*='size-'])]:size-3.5",
    gap: 1.5,
  },
  default: {
    button: "h-control-md min-w-control-md px-2",
    gap: 1.5,
  },
  lg: {
    button: "h-control-lg min-w-control-lg px-2.5",
    gap: 2,
  },
}

// The icon–label gap sits on the label's side facing the icon: inline-start
// when the icon leads, inline-end when it trails. Literal classes, since
// Tailwind needs to see each one.
const labelGap = {
  start: {
    1: "group-hover/reveal:ps-1 group-focus-visible/reveal:ps-1",
    1.5: "group-hover/reveal:ps-1.5 group-focus-visible/reveal:ps-1.5",
    2: "group-hover/reveal:ps-2 group-focus-visible/reveal:ps-2",
  },
  end: {
    1: "group-hover/reveal:pe-1 group-focus-visible/reveal:pe-1",
    1.5: "group-hover/reveal:pe-1.5 group-focus-visible/reveal:pe-1.5",
    2: "group-hover/reveal:pe-2 group-focus-visible/reveal:pe-2",
  },
}

// The text slides out from behind the icon, so it starts shifted toward the
// icon's side — mirrored in RTL.
const labelSlide = {
  start: "-translate-x-2 rtl:translate-x-2",
  end: "translate-x-2 rtl:-translate-x-2",
}

type RevealButtonSize = keyof typeof sizes

function RevealButton({
  className,
  variant = "default",
  size = "default",
  iconSide = "start",
  label,
  children,
  ...props
}: ButtonPrimitive.Props &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    /** Revealed beside the icon while hovered or focused; also the name. */
    label: string
    size?: RevealButtonSize
    iconSide?: "start" | "end"
  }) {
  const labelEl = (
    <span
      data-slot="reveal-button-label"
      className={cn(
        "grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,padding-inline-start,padding-inline-end,opacity] duration-(--duration-moderate) ease-standard group-hover/reveal:grid-cols-[1fr] group-hover/reveal:opacity-100 group-focus-visible/reveal:grid-cols-[1fr] group-focus-visible/reveal:opacity-100",
        labelGap[iconSide][sizes[size].gap as keyof (typeof labelGap)["start"]]
      )}
    >
      <span
        className={cn(
          "min-w-0 overflow-hidden whitespace-nowrap transition-transform duration-(--duration-moderate) ease-standard group-hover/reveal:translate-x-0 group-focus-visible/reveal:translate-x-0 rtl:group-hover/reveal:translate-x-0 rtl:group-focus-visible/reveal:translate-x-0",
          labelSlide[iconSide]
        )}
      >
        {label}
      </span>
    </span>
  )
  return (
    <ButtonPrimitive
      data-slot="reveal-button"
      className={cn(
        buttonVariants({ variant }),
        "group/reveal gap-0",
        sizes[size].button,
        className
      )}
      {...props}
    >
      {iconSide === "end" ? (
        <>
          {labelEl}
          {children}
        </>
      ) : (
        <>
          {children}
          {labelEl}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { RevealButton }
