import * as React from "react"

import { Skeleton } from "@amit-kap/glaze/components/skeleton"
import { loadComponent, type ComponentEntry } from "./registry"
import { StoryCard } from "./story-card"

// Components whose stories need the full row, besides those that ask for
// `layout: "fullscreen"`.
const WIDE = new Set([
  "carousel",
  "chart",
  "data-table",
  "menubar",
  "message-scroller",
  "navigation-menu",
  "pagination",
  "questionnaire",
  "resizable",
  "sidebar",
  "table",
])

const gridClass = "grid grid-cols-1 gap-3 xl:grid-cols-2"

// Descriptions are Markdown-lite: only `code` spans occur.
function Description({ text }: { text: string }) {
  return (
    <p className="mt-2 max-w-prose text-body text-muted-foreground">
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="font-mono text-caption text-foreground">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </p>
  )
}

function Body({ entry }: { entry: ComponentEntry }) {
  const loaded = React.use(loadComponent(entry.id))
  return (
    <>
      {loaded.description && <Description text={loaded.description} />}
      <div data-testid="variant-grid" className={`${gridClass} mt-8`}>
        {loaded.stories.map((story) => (
          <StoryCard
            key={story.key}
            id={entry.id}
            entry={story}
            loaded={loaded}
            wide={WIDE.has(entry.id)}
          />
        ))}
      </div>
    </>
  )
}

class LoadBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <p
          data-testid="variant-error"
          className="mt-8 text-body text-muted-foreground"
        >
          Couldn&apos;t load this component.
        </p>
      )
    return this.props.children
  }
}

export function ComponentView({ entry }: { entry: ComponentEntry }) {
  return (
    <section aria-labelledby="component-title">
      <h1 id="component-title" className="text-heading font-strong">
        {entry.name}
      </h1>
      <LoadBoundary key={entry.id}>
        <React.Suspense
          fallback={
            <div className={`${gridClass} mt-8`}>
              <Skeleton className="h-72" />
              <Skeleton className="h-72" />
            </div>
          }
        >
          <Body entry={entry} />
        </React.Suspense>
      </LoadBoundary>
    </section>
  )
}
