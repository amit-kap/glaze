import { readdirSync } from "node:fs"
import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The showcase has one page per Storybook story file. The home page lists
// them by name and links to each page, so it reads the same folder.
const stories = resolve(import.meta.dirname, "../storybook/src/stories")
const components = readdirSync(stories)
  .filter((file) => file.endsWith(".stories.tsx"))
  .map((file) => file.replace(/\.stories\.tsx$/, ""))
  .sort()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __COMPONENTS__: JSON.stringify(components) },
  resolve: {
    alias: {
      // The live preview renders the showcase's demos.
      "@showcase": resolve(import.meta.dirname, "../showcase/src"),
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
