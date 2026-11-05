import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
// The deployed site is built against the published package (see
// scripts/studio-build.mjs). Locally, Studio uses packages/ui from source, so a
// component edit shows at once.
const published = process.env.GLAZE_PACKAGE_DIR

// The published package's exports map, as aliases: its files sit outside the
// workspace link, so each export is pointed at its file.
const publishedAliases = published
  ? [
      {
        find: /^@amit-kap\/glaze\/(globals|tokens)\.css/,
        replacement: `${published}/styles/$1.css`,
      },
      {
        find: /^@amit-kap\/glaze\/themes\//,
        replacement: `${published}/styles/themes/`,
      },
      {
        find: /^@amit-kap\/glaze\/theme$/,
        replacement: `${published}/lib/theme.js`,
      },
      { find: /^@amit-kap\/glaze\//, replacement: `${published}/` },
    ]
  : []

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The version shown in the top bar; null in local development.
  define: {
    __GLAZE_VERSION__: JSON.stringify(process.env.GLAZE_VERSION ?? null),
  },
  resolve: {
    alias: [
      ...publishedAliases,
      {
        find: "@showcase",
        replacement: resolve(import.meta.dirname, "../showcase/src"),
      },
      { find: "@", replacement: resolve(import.meta.dirname, "./src") },
    ],
  },
  // PORT lets a launcher pick a free port; 5186 otherwise.
  server: { port: Number(process.env.PORT) || 5186 },
})
