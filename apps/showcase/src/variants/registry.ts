// The component list and the story loader. Each Storybook story file is one
// component; nothing is loaded until its page is opened.

export type StoryObject = {
  name?: string
  args?: Record<string, unknown>
  parameters?: Record<string, unknown>
  decorators?: Decorator[]
  render?: (args: Record<string, unknown>, context: unknown) => React.ReactNode
  tags?: string[]
}

export type Decorator = (
  Story: React.ComponentType,
  context: unknown
) => React.ReactNode

export type Meta = StoryObject & {
  title?: string
  component?: React.ElementType
  excludeStories?: RegExp | string[]
  includeStories?: RegExp | string[]
}

type StoryModule = { default: Meta } & Record<string, unknown>

const modules = import.meta.glob<StoryModule>(
  "../../../storybook/src/stories/*.stories.tsx"
)
const sources = import.meta.glob<string>(
  "../../../storybook/src/stories/*.stories.tsx",
  { query: "?raw", import: "default" }
)

export type ComponentEntry = { id: string; name: string }

const NAMES: Record<string, string> = { "input-otp": "Input OTP" }

const toId = (path: string) =>
  path.slice(path.lastIndexOf("/") + 1).replace(/\.stories\.tsx$/, "")

const titleCase = (id: string) =>
  NAMES[id] ??
  id.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())

export const components: ComponentEntry[] = Object.keys(modules)
  .map((path) => ({ id: toId(path), name: titleCase(toId(path)) }))
  .sort((a, b) => a.name.localeCompare(b.name))

export type VariantStory = {
  key: string
  name: string
  story: StoryObject | ((args: Record<string, unknown>) => React.ReactNode)
}

export type LoadedComponent = {
  meta: Meta
  description?: string
  stories: VariantStory[]
}

// "WithIcon" -> "With Icon"
export const humanise = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")

const matches = (rule: Meta["excludeStories"], key: string) =>
  rule instanceof RegExp ? rule.test(key) : (rule?.includes(key) ?? false)

const cache = new Map<string, Promise<LoadedComponent>>()

export function loadComponent(id: string): Promise<LoadedComponent> {
  let pending = cache.get(id)
  if (!pending) {
    const path = Object.keys(modules).find((p) => toId(p) === id)
    if (!path) return Promise.reject(new Error(`No stories for ${id}`))
    pending = Promise.all([modules[path](), sources[path]()]).then(
      ([module, source]) => {
        const meta = module.default
        // Module namespaces list exports alphabetically; the file order is the
        // authored one, so read it from the source.
        const order = [...source.matchAll(/^export (?:const|function) (\w+)/gm)]
          .map((m) => m[1])
          .filter((key) => key in module)
        const keys = [
          ...order,
          ...Object.keys(module).filter((key) => !order.includes(key)),
        ].filter(
          (key) =>
            key !== "default" &&
            !key.startsWith("__") &&
            (!meta.includeStories || matches(meta.includeStories, key)) &&
            !matches(meta.excludeStories, key)
        )
        const stories = keys.flatMap((key): VariantStory[] => {
          const story = module[key] as VariantStory["story"] | undefined
          if (typeof story !== "function" && typeof story !== "object")
            return []
          if (!story) return []
          const named = typeof story === "object" ? story.name : undefined
          return [{ key, name: named ?? humanise(key), story }]
        })
        const docs = (meta.parameters?.docs ?? {}) as {
          description?: { component?: string }
        }
        return { meta, description: docs.description?.component, stories }
      }
    )
    cache.set(id, pending)
  }
  return pending
}
