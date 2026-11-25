import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./app.css"
import { ThemeProvider } from "@amit-kap/glaze/theme"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"
import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="nova"
      defaultMode="system"
      storageKey="glaze-home"
    >
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
