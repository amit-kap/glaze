import * as React from "react"

/*
 * Shared chrome for the Theme stories. These pages document the token
 * contract rather than a component, so they read values from the live
 * cascade (whatever data-theme / .dark / data-density the toolbar set)
 * instead of restating them. Switching a toolbar global re-reads every
 * value, which is the point of the section.
 */

export function Page({
  title,
  lead,
  children,
}: {
  title: string
  lead: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-12 px-10 py-14">
        <header className="flex flex-col gap-3">
          <div className="font-mono text-caption tracking-[0.16em] text-muted-foreground uppercase">
            Theme
          </div>
          <h1 className="text-display font-strong tracking-[-0.02em]">
            {title}
          </h1>
          <p className="max-w-[64ch] text-body text-muted-foreground">{lead}</p>
        </header>
        {children}
      </div>
    </div>
  )
}

export function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-title font-strong">{title}</h2>
        {note ? (
          <p className="max-w-[72ch] text-body text-muted-foreground">{note}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

/** Reads the live value of tokens from the root element. */
export function useTokens(names: string[]) {
  const key = names.join("|")
  const [values, setValues] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      setValues(
        Object.fromEntries(
          names.map((name) => [name, cs.getPropertyValue(name).trim()])
        )
      )
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
    // names is stable per page; key captures its contents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return values
}

/**
 * Mounts an element with the given style and reports the computed values of
 * the requested properties ("width", "font-size", ...). Sizes arrive as px
 * even when the token is authored in rem or calc().
 */
export function useMeasured(style: React.CSSProperties, props: string[]) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [values, setValues] = React.useState<Record<string, string>>({})
  const styleKey = JSON.stringify(style)
  const propsKey = props.join("|")

  React.useEffect(() => {
    const read = () => {
      const el = ref.current
      if (!el) return
      const cs = getComputedStyle(el)
      setValues(
        Object.fromEntries(
          propsKey.split("|").map((prop) => [prop, cs.getPropertyValue(prop)])
        )
      )
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [styleKey, propsKey])

  return { ref, values }
}

export function Mono({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`font-mono text-caption ${className}`}>{children}</span>
  )
}

export function Value({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block truncate font-mono text-[10px] leading-4 text-muted-foreground"
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </span>
  )
}

export function TokenUse({
  surface,
  usage,
}: {
  surface: string
  usage: string
}) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border/60 py-2 last:border-0">
      <div className="w-56 shrink-0 font-mono text-caption text-foreground">
        {surface}
      </div>
      <div className="text-body text-muted-foreground">{usage}</div>
    </div>
  )
}
