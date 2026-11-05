import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
      // The Components tab shows the showcase's own tiles, so there is one set.
      "@showcase": resolve(import.meta.dirname, "../showcase/src"),
    },
  },
  // PORT lets a launcher pick a free port; 5186 otherwise.
  server: { port: Number(process.env.PORT) || 5186 },
})
