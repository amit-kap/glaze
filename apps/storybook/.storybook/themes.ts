// Glaze themes for the toolbar. Every CSS file in the library's themes folder
// and in Storybook's own test themes folder is loaded and listed by file name.
const themeFiles = import.meta.glob(
  [
    "../../../packages/ui/src/styles/themes/*.css",
    "../src/themes/*.css",
  ],
  { eager: true }
)

const names = Object.keys(themeFiles)
  .map((path) => path.split("/").pop()!.replace(/\.css$/, ""))
  .filter((name) => name !== "nova")
  .sort()

export const themes = ["nova", ...names].map((name) => ({
  value: name,
  title: name[0].toUpperCase() + name.slice(1),
}))
