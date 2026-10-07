import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./app.css"
import { ThemeProvider } from "@amit-kap/glaze/theme"
import { Toaster } from "@amit-kap/glaze/components/toast"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="nova" defaultMode="system" storageKey="glaze-showcase">
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
