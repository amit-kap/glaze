// Does every value Studio edits reach the preview? Run it in the browser with
// the dev server up (npm run dev -w studio), from the console:
//
//   const { auditTheme } = await import("/audit/theme-audit.js")
//   await auditTheme()
//
// For each editable value it sets a loud probe on the themed section, compares
// how every element in the preview is drawn before and after, on each screen
// and in light and dark, and lists the values that changed nothing anywhere.
// A listed value is either broken, or not used by any screen (or only visible
// while something is hovered, open or closing: an overlay, a menu highlight,
// an exit animation). Static screens can't show those, so read the list.

const SCREENS = ["Dashboard", "Checkout", "Harness", "Landing"]

// One probe per kind of value, chosen to differ visibly from any default.
const PROBES = {
  color: "oklch(0.55 0.27 140)",
  length: "13px",
  radius: "23px",
  height: "51px",
  shadow: "0 9px 9px red",
  duration: "913ms",
  easing: "cubic-bezier(.1,.9,.3,.4)",
  number: "0.37",
  font: "Georgia, serif",
  text: "31px",
  weight: "900",
}

const PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "outlineColor",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "borderTopLeftRadius",
  "boxShadow",
  "paddingTop",
  "paddingLeft",
  "height",
  "width",
  "transitionDuration",
  "transitionTimingFunction",
  "gap",
  "fill",
  "stroke",
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function auditTheme() {
  const catalog = await import("@amit-kap/glaze/theme/catalog")
  const theme = await import("/src/theme.ts")
  const shape = await import("/src/shape.ts")
  const type = await import("/src/typography.ts")
  const motion = await import("/src/motion.ts")

  const tokens = [
    ...theme.tokens,
    ...type.typeTokens,
    ...shape.shapeTokens,
    ...motion.motionTokens,
  ]
  const kindOf = Object.fromEntries(
    catalog.settings.map((s) => [s.token.replace(/^--/, ""), s.kind])
  )
  const section = document.querySelector("section[data-theme=nova]")

  const snapshot = () =>
    [...section.querySelectorAll("*")].map((el) => {
      const style = getComputedStyle(el)
      return PROPS.map((prop) => style[prop]).join("|")
    })

  async function pass() {
    const changes = Object.fromEntries(tokens.map((t) => [t, 0]))
    for (const name of SCREENS) {
      const tab = [...document.querySelectorAll("[role=tab]")].find((t) =>
        t.textContent.startsWith(name)
      )
      tab?.click()
      await sleep(700)
      const base = snapshot()
      for (const token of tokens) {
        const was = section.style.getPropertyValue(`--${token}`)
        section.style.setProperty(`--${token}`, PROBES[kindOf[token]] ?? "7")
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const after = snapshot()
        for (let i = 0; i < Math.min(base.length, after.length); i++)
          if (base[i] !== after[i]) changes[token]++
        if (was === "") section.style.removeProperty(`--${token}`)
        else section.style.setProperty(`--${token}`, was)
      }
    }
    return tokens.filter((token) => !changes[token])
  }

  const light = await pass()
  section.classList.add("dark")
  await sleep(300)
  const dark = await pass()
  section.classList.remove("dark")

  return { total: tokens.length, noEffectLight: light, noEffectDark: dark }
}
