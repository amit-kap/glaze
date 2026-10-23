import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./app.css"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"
import { App } from "./app"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
