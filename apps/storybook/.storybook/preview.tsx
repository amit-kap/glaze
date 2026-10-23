import type { Decorator, Preview } from "@storybook/react-vite"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"

import "@amit-kap/glaze/globals.css"
import "./preview.css"

// Applies the Glaze switches to the preview's <html>, as a project would.
// Nova is the only built-in theme, so the theme attribute is fixed.
const withGlaze: Decorator = (Story, context) => {
  const { mode, density } = context.globals
  const root = document.documentElement

  root.setAttribute("data-theme", "nova")

  root.classList.toggle("dark", mode === "dark")

  if (density === "compact") root.setAttribute("data-density", "compact")
  else root.removeAttribute("data-density")

  return <Story />
}

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        if (a.title === b.title) {
          // Keep component examples in their authored order; order only Theme pages.
          if (a.title !== "Theme") return 0
          const order = [
            "Colors",
            "Typography",
            "Spacing & size",
            "Corners",
            "Shadows",
            "Motion",
            "Component details",
          ]
          return order.indexOf(a.name) - order.indexOf(b.name)
        }
        return a.title.localeCompare(b.title, undefined, { numeric: true })
      },
    },
    a11y: { test: "todo" },
  },
  globalTypes: {
    mode: {
      description: "Light or dark mode",
      toolbar: {
        title: "Mode",
        icon: "sun",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Spacing and control size",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "comfortable", title: "Comfortable" },
          { value: "compact", title: "Compact" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    mode: "light",
    density: "comfortable",
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    withGlaze,
  ],
}

export default preview
