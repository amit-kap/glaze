import { DemoTile, tiles } from "@showcase/tiles"

/** The showcase's component tiles, themed by the draft like every other screen. */
export function ComponentsScreen() {
  return (
    <div className="h-full overflow-y-auto bg-background p-4">
      <div className="grid grid-flow-dense grid-cols-1 gap-3 @max-[699px]:*:col-span-1! @min-[700px]:grid-cols-2 @min-[1100px]:grid-cols-3">
        {tiles.map(({ name, demo: Demo, wide }) => (
          <DemoTile key={name} name={name} wide={wide}>
            <Demo />
          </DemoTile>
        ))}
      </div>
    </div>
  )
}
