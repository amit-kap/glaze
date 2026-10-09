import * as React from "react"
import { Toaster, createToastManager } from "@amit-kap/glaze/components/toast"

// Stand-in for sonner's `toast(title, { description })`, used by examples
// copied from upstream. Render `<ExampleToaster />` once per story.
const manager = createToastManager()

export function toast(title: string, options?: { description?: string }) {
  manager.add({ title, description: options?.description })
}

// The Docs page renders every story at once, so only the first mounted
// ExampleToaster renders; the rest stay empty.
const mounted: symbol[] = []
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function ExampleToaster() {
  const [id] = React.useState(() => Symbol("toaster"))
  const owner = React.useSyncExternalStore(
    subscribe,
    () => mounted[0] ?? null,
    () => null
  )

  React.useEffect(() => {
    mounted.push(id)
    listeners.forEach((listener) => listener())
    return () => {
      mounted.splice(mounted.indexOf(id), 1)
      listeners.forEach((listener) => listener())
    }
  }, [id])

  return owner === id ? <Toaster toastManager={manager} /> : null
}
