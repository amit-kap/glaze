"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@amit-kap/glaze/lib/utils"

// A slider whose track is a capsule wrapping the thumb: the thumb sits inside
// with a small inset and the fill runs past the indicator to hug it. Same
// proportions as Switch (fixed track, inset thumb). The capsule is a `before`
// on the control, so the real track can stay transparent and inset with the
// thumb; the control is taller than the capsule to give a 40px+ hit area.
// Horizontal only; the stock Slider covers vertical.
const sizes = {
  sm: {
    control: "h-10 before:h-5",
    track: "h-4",
    thumb: "size-4",
    fillEnd: "after:-inset-e-2.5",
    fillStart: "after:-inset-s-2.5",
    // half the thumb, so dots line up with the thumb stops.
    dots: "px-2",
  },
  default: {
    control: "h-11 before:h-6",
    track: "h-5",
    thumb: "size-5",
    fillEnd: "after:-inset-e-3",
    fillStart: "after:-inset-s-3",
    dots: "px-2.5",
  },
  lg: {
    control: "h-12 before:h-7",
    track: "h-6",
    thumb: "size-6",
    fillEnd: "after:-inset-e-3.5",
    fillStart: "after:-inset-s-3.5",
    dots: "px-3",
  },
}

function InsetSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  size = "default",
  ticks = false,
  showMinMax = false,
  ...props
}: Omit<SliderPrimitive.Root.Props, "orientation"> & {
  size?: keyof typeof sizes
  /** Draw a dot inside the track at every step. Keep it to about 20 stops or fewer. */
  ticks?: boolean
  /** Show the current value before the track and the max after it. */
  showMinMax?: boolean
}) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : typeof value === "number"
        ? [value]
        : typeof defaultValue === "number"
          ? [defaultValue]
          : [min]
  const s = sizes[size]
  const stops = ticks ? Math.floor((max - min) / step) + 1 : 0

  return (
    <SliderPrimitive.Root
      className={cn(
        showMinMax ? "flex w-full items-center gap-3" : "w-full",
        className
      )}
      data-slot="inset-slider"
      data-size={size}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      thumbAlignment="edge"
      {...props}
    >
      {showMinMax ? (
        <SliderPrimitive.Value
          data-slot="inset-slider-value"
          className="min-w-[3ch] text-end text-caption font-medium text-foreground tabular-nums"
        />
      ) : null}
      <SliderPrimitive.Control
        className={cn(
          "group/control relative flex min-w-0 flex-1 cursor-ew-resize touch-none items-center px-0.5 select-none",
          "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:rounded-pill before:bg-muted before:ring-1 before:ring-border before:transition-shadow before:ring-inset",
          "hover:before:ring-muted-foreground has-focus-visible:before:ring-foreground data-disabled:cursor-default data-disabled:opacity-50",
          s.control
        )}
      >
        <SliderPrimitive.Track
          data-slot="inset-slider-track"
          className={cn("relative grow select-none", s.track)}
        >
          <SliderPrimitive.Indicator
            data-slot="inset-slider-range"
            className={cn(
              "select-none",
              // the fill is a pseudo-element so it can run past the indicator
              // to hug the thumb, inset included.
              "after:absolute after:-inset-y-0.5 after:rounded-pill after:bg-primary",
              _values.length > 1 ? s.fillStart : "after:-inset-s-0.5",
              s.fillEnd
            )}
          />
          {ticks ? (
            <div
              aria-hidden
              data-slot="inset-slider-ticks"
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-between",
                s.dots
              )}
            >
              {Array.from({ length: stops }, (_, i) => (
                <i
                  key={i}
                  className="size-0.75 rounded-pill bg-muted-foreground"
                />
              ))}
            </div>
          ) : null}
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="inset-slider-thumb"
              key={index}
              className={cn(
                "relative block shrink-0 rounded-pill bg-(--slider-thumb-fill) select-none after:absolute after:-inset-2 focus-visible:outline-hidden disabled:pointer-events-none",
                s.thumb
              )}
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
      {showMinMax ? (
        <span
          aria-hidden
          data-slot="inset-slider-max"
          className="min-w-[3ch] text-caption text-muted-foreground tabular-nums"
        >
          {max}
        </span>
      ) : null}
    </SliderPrimitive.Root>
  )
}

export { InsetSlider }
