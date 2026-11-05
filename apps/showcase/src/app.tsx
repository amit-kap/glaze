import { DemoTile, tiles } from "./tiles"

export function App() {
  return (
    <div className="min-h-svh bg-background px-3 pt-3 pb-6 text-foreground sm:px-6 sm:pt-6">
      <main className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {tiles.map(({ name, demo: Demo, wide }) => (
          <DemoTile key={name} name={name} wide={wide}>
            <Demo />
          </DemoTile>
        ))}
      </main>
    </div>
  )
}
