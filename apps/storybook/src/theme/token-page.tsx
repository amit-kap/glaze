import * as React from "react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Page,
  Section,
  Value,
  useMeasured,
  useTokens,
  usePaintedColors,
  formatOklch,
} from "./docs"
import {
  themeSections,
  followsLabels,
  type TokenDoc,
  type TokenGroup,
} from "./tokens"

/** Identify explicit theme declarations, not the default derivation rules. */
function useThemeOverrides() {
  const [overrides, setOverrides] = React.useState<Set<string>>(new Set())
  React.useEffect(() => {
    const read = () => {
      const root = document.documentElement
      const names = new Set<string>()
      const visit = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          if (
            rule instanceof CSSMediaRule &&
            !matchMedia(rule.conditionText).matches
          )
            continue
          if (rule instanceof CSSStyleRule) {
            // A theme's own block (including its light-only :not() rule)
            // outranks the shared derivation.
            if (
              /\[data-theme\s*=|:root:not\(/.test(rule.selectorText) &&
              root.matches(rule.selectorText)
            ) {
              for (const name of Array.from(rule.style))
                if (name.startsWith("--")) names.add(name)
            }
          }
          if ("cssRules" in rule) visit((rule as CSSGroupingRule).cssRules)
        }
      }
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          visit(sheet.cssRules)
        } catch {
          /* Cross-origin font sheets have no theme declarations. */
        }
      }
      setOverrides(names)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => observer.disconnect()
  }, [])
  return overrides
}

function valueStyle(item: TokenDoc): React.CSSProperties {
  const value = item.fallback
    ? `var(${item.token}, ${item.fallback})`
    : `var(${item.token})`
  switch (item.kind) {
    case "color":
      return { backgroundColor: `color-mix(in oklch, ${value}, ${value})` }
    case "font":
      return { fontFamily: value }
    case "text":
      return { fontSize: value }
    case "number":
      return item.token.includes("leading") ||
        item.token.endsWith("--line-height")
        ? { fontSize: "100px", lineHeight: value }
        : {}
    case "weight":
      return { fontWeight: value }
    case "radius":
      return { borderRadius: value }
    case "shadow":
      return { boxShadow: value }
    case "height":
      return { height: value }
    case "length":
      return { width: value }
    case "duration":
      return { animationDuration: value }
    case "easing":
      return { animationTimingFunction: value }
    default:
      return {}
  }
}
const properties = {
  color: "background-color",
  font: "font-family",
  text: "font-size",
  weight: "font-weight",
  radius: "border-top-left-radius",
  shadow: "box-shadow",
  height: "height",
  length: "width",
  duration: "animation-duration",
  easing: "animation-timing-function",
  number: "",
} as const

function MotionPreview({ item }: { item: TokenDoc }) {
  const [playing, setPlaying] = React.useState(false)
  const { ref, values } = useMeasured(
    { animationDuration: "var(--duration-moderate)" },
    ["animation-duration"]
  )
  const reduced = Number.parseFloat(values["animation-duration"] || "0") === 0
  return (
    <div className="flex items-center gap-3">
      <span
        ref={ref}
        style={{ animationDuration: "var(--duration-moderate)" }}
        aria-hidden
        className="hidden"
      />
      <div
        className="flex h-6 w-32 items-center rounded-pill bg-muted px-2"
        aria-hidden
      >
        <span
          className="size-3 rounded-pill bg-primary"
          style={{
            animationName: playing && !reduced ? "glaze-token-travel" : "none",
            animationDuration:
              item.kind === "duration"
                ? `var(${item.token})`
                : "var(--duration-moderate)",
            animationTimingFunction:
              item.kind === "easing"
                ? `var(${item.token})`
                : "var(--ease-standard)",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
      </div>
      <Button
        size="xs"
        variant="outline"
        disabled={reduced}
        onClick={() => setPlaying(!playing)}
        aria-label={`${playing ? "Pause" : "Play"} ${item.label}`}
      >
        {playing ? "Pause" : "Play"}
      </Button>
    </div>
  )
}

function TokenRow({
  item,
  overrides,
  nested = false,
}: {
  item: TokenDoc
  overrides: Set<string>
  nested?: boolean
}) {
  const raw = useTokens([item.token])
  const style = valueStyle(item)
  const leading =
    item.token.includes("leading") || item.token.endsWith("--line-height")
  const property = leading ? "line-height" : properties[item.kind]
  const { ref, values } = useMeasured(style, property ? [property] : [])
  // Color probes resolve color-mix() into one consistent OKLCH value.
  const { values: painted, probes } = usePaintedColors(
    item.kind === "color" && !item.fallback ? [item.token] : []
  )
  let value = item.kind === "number" ? raw[item.token] : values[property]
  if (leading && values[property])
    value = `${Number((Number.parseFloat(values[property]) / 100).toFixed(3))}×`
  if (item.kind === "color")
    value = painted[item.token] || formatOklch(value || "")
  if (item.kind === "radius" && Number.parseFloat(value || "") > 999)
    value = "pill"
  if (item.kind === "duration" && value?.endsWith("s") && !value.endsWith("ms"))
    value = `${Math.round(Number.parseFloat(value) * 1000)}ms`
  if (item.kind === "shadow" && value === "rgba(0, 0, 0, 0) 0px 0px 0px 0px")
    value = "none"
  const override = nested && overrides.has(item.token)
  const relation = override
    ? "Theme override"
    : item.fixed
      ? "Fixed"
      : item.setting
        ? "Setting"
        : item.input && !nested
          ? "Input"
          : item.follows?.length
            ? `Follows ${followsLabels(item.follows).join(" + ")}`
            : nested
              ? "Derived"
              : ""
  return (
    <div className="min-w-0 border-b border-border/60 py-4 last:border-0">
      {probes}
      <span
        ref={ref}
        style={style}
        aria-hidden
        className="pointer-events-none absolute opacity-0"
      />
      <div className="grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)] sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {!nested && <h3 className="text-body font-medium">{item.label}</h3>}
            <code className="font-mono text-caption break-all">
              {item.token}
            </code>
            {relation && (
              <span className="text-caption text-muted-foreground">
                {relation}
              </span>
            )}
          </div>
          <p className="mt-1 text-caption text-muted-foreground">{item.note}</p>
          {item.consumers?.length ? (
            <p className="mt-1 text-caption text-muted-foreground">
              Used by {item.consumers.slice(0, 8).join(", ")}
              {item.consumers.length > 8
                ? ` +${item.consumers.length - 8} more`
                : ""}
            </p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          {value && value.length > 160 ? (
            <details>
              <summary className="cursor-pointer text-caption text-muted-foreground">
                View CSS value
              </summary>
              <Value>{value}</Value>
            </details>
          ) : (
            <Value>{value || "—"}</Value>
          )}
          {item.fallback && !raw[item.token] && (
            <span className="text-caption text-muted-foreground">
              Using fallback
            </span>
          )}
          {!nested && (
            <>
              {item.kind === "color" && (
                <div
                  className="h-8 w-16 rounded-item border border-border"
                  style={{
                    background:
                      "repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%) 0 / 8px 8px",
                  }}
                >
                  <div className="size-full rounded-[inherit]" style={style} />
                </div>
              )}
              {item.kind === "radius" && (
                <div
                  className="h-12 w-24 border border-border bg-muted"
                  style={style}
                />
              )}
              {item.kind === "shadow" && (
                <div className="rounded-container bg-muted p-4">
                  <div className="h-10 rounded-item bg-card" style={style} />
                </div>
              )}
              {(item.kind === "font" ||
                item.kind === "text" ||
                item.kind === "weight") && (
                <span className="break-words" style={style}>
                  Glaze Aa 0123
                </span>
              )}
              {item.kind === "height" && (
                <div
                  className="w-24 rounded-control border border-border bg-muted"
                  style={style}
                />
              )}
              {(item.kind === "duration" || item.kind === "easing") && (
                <MotionPreview item={item} />
              )}
            </>
          )}
        </div>
      </div>
      {item.affects?.length ? (
        <details className="mt-3">
          <summary className="w-fit cursor-pointer text-caption text-muted-foreground">
            Affects {item.affects.length}{" "}
            {item.affects.length === 1 ? "token" : "tokens"}
          </summary>
          <div className="mt-2 border-s border-border ps-4 sm:ps-6">
            {item.affects.map((affected) => (
              <TokenRow
                key={affected.token}
                item={affected}
                overrides={overrides}
                nested
              />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  )
}

function Group({
  group,
  overrides,
}: {
  group: TokenGroup
  overrides: Set<string>
}) {
  const rows = group.items.map((item) => (
    <TokenRow key={item.token} item={item} overrides={overrides} />
  ))
  if (group.collapsed)
    return (
      <details className="border-t border-border pt-8">
        <summary className="cursor-pointer text-title font-strong">
          {group.title}
        </summary>
        <p className="mt-2 text-body text-muted-foreground">{group.note}</p>
        <div className="mt-4">{rows}</div>
      </details>
    )
  return (
    <Section title={group.title} note={group.note}>
      <div>{rows}</div>
    </Section>
  )
}

export function TokenPage({ sectionId }: { sectionId: string }) {
  const section = themeSections.find((entry) => entry.id === sectionId)!
  const overrides = useThemeOverrides()
  return (
    <Page title={section.title} lead={section.note}>
      <style>{`@keyframes glaze-token-travel { from { transform: translateX(0); } to { transform: translateX(96px); } }`}</style>
      <p className="max-w-[72ch] text-caption text-muted-foreground">
        Values follow the toolbar. A row shows where its value comes from;
        expand “Affects” to see what it changes. A theme that sets a value
        itself replaces the default recipe.
      </p>
      {section.groups.map((group) => (
        <Group key={group.title} group={group} overrides={overrides} />
      ))}
    </Page>
  )
}
