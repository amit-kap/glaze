import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./app.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/figtree"
import "@fontsource-variable/noto-sans"
import "@fontsource-variable/playfair-display"
import "@fontsource-variable/jetbrains-mono"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
