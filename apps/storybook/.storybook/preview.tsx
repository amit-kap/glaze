import type { Decorator, Preview } from "@storybook/react-vite"
import { TooltipProvider } from "@amit-kap/glaze/components/tooltip"

import "@amit-kap/glaze/globals.css"
import { themes } from "./themes"

// Applies the three Glaze switches to the preview's <html>, as a project would.
const withGlaze: Decorator = (Story, context) => {
  const { theme, mode, density } = context.globals
  const root = document.documentElement

  if (theme && theme !== "default") root.setAttribute("data-theme", theme)
  else root.removeAttribute("data-theme")

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
    a11y: { test: "todo" },
  },
  globalTypes: {
    theme: {
      description: "Glaze theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: themes,
        dynamicTitle: true,
      },
    },
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
    theme: "default",
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
