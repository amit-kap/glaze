import * as React from "react"

import { DemoTile } from "../tiles"
import type { Decorator, LoadedComponent, VariantStory } from "./registry"

type Args = Record<string, unknown>

type Chain = {
  decorators: Decorator[]
  context: unknown
  base: () => React.ReactNode
}

const ChainContext = React.createContext<{ chain: Chain; index: number }>({
  chain: { decorators: [], context: null, base: () => null },
  index: 0,
})

// One layer of the decorator chain: a decorator receives the rest of the chain
// as its `Story`; past the last decorator comes the story itself.
function Layer() {
  const { chain, index } = React.useContext(ChainContext)
  if (index >= chain.decorators.length) return <>{chain.base()}</>
  return <>{chain.decorators[index](Next, chain.context)}</>
}

function Next() {
  const { chain, index } = React.useContext(ChainContext)
  return (
    <ChainContext value={{ chain, index: index + 1 }}>
      <Layer />
    </ChainContext>
  )
}

// Renders one story the way Storybook does, without Storybook: the meta's args
// under the story's, the story's render (or the meta's, or the component), and
// the story's decorators inside the meta's. `play` functions are not run.
function StoryBody({
  id,
  entry,
  loaded,
}: {
  id: string
  entry: VariantStory
  loaded: LoadedComponent
}) {
  const { meta } = loaded
  const story = entry.story
  const isFn = typeof story === "function"
  const [value] = React.useState(() => {
    // A story that starts open (an alert dialog, say) would cover the whole
    // page here, so every card starts closed and opens from its trigger.
    const args: Args = {
      ...meta.args,
      ...(isFn ? {} : story.args),
      defaultOpen: undefined,
    }
    const render = isFn ? story : (story.render ?? meta.render)
    const Component = meta.component
    const context = {
      id: `${id}--${entry.key}`,
      name: entry.name,
      title: meta.title,
      args,
      argTypes: {},
      parameters: { ...meta.parameters, ...(isFn ? {} : story.parameters) },
      globals: {},
      viewMode: "story",
      loaded: {},
      component: Component,
    }
    const chain: Chain = {
      decorators: [
        ...((!isFn && story.decorators) || []),
        ...(meta.decorators ?? []),
      ],
      context,
      base: () => {
        if (render) return render(args, context)
        if (Component) return <Component {...args} />
        throw new Error("This story has no render function or component.")
      },
    }
    return { chain, index: 0 }
  })
  return (
    <ChainContext value={value}>
      <Layer />
    </ChainContext>
  )
}

class StoryBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.error(error)
  }
  render() {
    if (this.state.failed)
      return (
        <p
          data-testid="variant-error"
          className="m-auto text-body text-muted-foreground"
        >
          Couldn&apos;t render
        </p>
      )
    return this.props.children
  }
}

// Wrapper that keeps fixed and absolutely placed content (the sidebar, drawers
// laid out in a frame) inside the card: a transform makes it the containing
// block, and the height replaces the window's.
const FRAME =
  "justify-start relative h-136 overflow-hidden transform-gpu [&>*]:w-full [&_[data-slot=sidebar-wrapper]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-0 [&_[data-slot=sidebar-container]]:h-full"

export function StoryCard({
  id,
  entry,
  loaded,
  wide,
}: {
  id: string
  entry: VariantStory
  loaded: LoadedComponent
  wide: boolean
}) {
  const story = entry.story
  const layout =
    (typeof story === "object" ? story.parameters?.layout : undefined) ??
    loaded.meta.parameters?.layout ??
    "centered"
  const fullscreen = layout === "fullscreen"

  return (
    <DemoTile
      name={entry.name}
      className={wide || fullscreen ? "xl:col-span-2" : undefined}
      contentClassName={
        fullscreen
          ? FRAME
          : layout === "padded"
            ? "items-stretch justify-start overflow-auto [&>*]:w-full"
            : "justify-start overflow-auto [&>*]:m-auto"
      }
      bleed={fullscreen}
      data-testid="variant-card"
      data-story={entry.key}
    >
      <StoryBoundary>
        <StoryBody id={id} entry={entry} loaded={loaded} />
      </StoryBoundary>
    </DemoTile>
  )
}
