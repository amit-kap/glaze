import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@fontsource-variable/figtree"
import "@fontsource-variable/inter"
import "@fontsource-variable/jetbrains-mono"
import "@fontsource-variable/playfair-display"
import "./app.css"
import { ThemeProvider } from "@amit-kap/glaze/theme"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"
import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="glaze"
      defaultMode="system"
      storageKey="glaze-site"
    >
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
