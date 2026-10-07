import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@amitka/glaze/globals.css"
import { TooltipProvider } from "@amitka/glaze/components/tooltip"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
