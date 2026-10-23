import type { Tool } from "./rail"

const notes: Record<Tool, string> = {
  colors: "Colour settings will live here.",
  type: "Type settings will live here.",
  shape: "Shape settings will live here.",
  motion: "Motion settings will live here.",
}

/** The content column. Each tool gets its own panel; none are built yet. */
export function Panel({ tool }: { tool: Tool }) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <p className="text-caption text-muted-foreground">{notes[tool]}</p>
    </div>
  )
}
