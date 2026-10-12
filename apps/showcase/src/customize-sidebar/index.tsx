import { RotateCcwIcon, XIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"

import {
  ColorSection,
  MotionSection,
  OutputSection,
  ShapeSection,
  SpacingSection,
  StatusChartsSection,
  TypographySection,
  type Mode,
  type ThemeEditor,
} from "./sections"
import { toHex } from "./fields"
import {
  inkFor,
  pxToRem,
  toPx,
  type Custom,
  type Defaults,
} from "../theme-builder"

// The Customize panel: sections of theme controls in a slide-in sidebar.
// `custom` holds only what the user changed; everything else reads through
// to `defaults`, the base theme's own values.
export function CustomizeSidebar({
  open,
  onOpenChange,
  custom,
  setCustom,
  defaults,
  customized,
  error,
  css,
  command,
  copied,
  onCopy,
  onReset,
  configJson,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  custom: Custom
  setCustom: (update: (c: Custom) => Custom) => void
  defaults: Defaults
  customized: boolean
  error: string | null
  css: string | null
  command: string
  copied: boolean
  onCopy: () => void
  onReset: () => void
  configJson: string
}) {
  const shared = (key: string) => custom.shared[key] ?? defaults.shared[key]
  const color = (m: Mode, key: string) => custom[m][key] ?? defaults[m][key]

  // An override equal to the theme's own is no change, so it's dropped.
  const setShared = (key: string, value: string, unchanged: boolean) =>
    setCustom((c) => {
      const next = { ...c.shared, [key]: value }
      if (unchanged) delete next[key]
      return { ...c, shared: next }
    })
  const setPx = (key: string, px: number) =>
    setShared(
      key,
      pxToRem(px),
      Math.abs(toPx(defaults.shared[key]) - px) < 0.01
    )
  const setNum = (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit = ""
  ) =>
    setShared(
      key,
      `${n}${unit}`,
      Math.abs(parse(defaults.shared[key]) - n) < 0.001
    )

  const setColor = (m: Mode, key: string, hex: string) =>
    setCustom((c) => {
      const next = { ...c[m], [key]: hex }
      if (toHex(defaults[m][key]) === hex) delete next[key]
      const out = { ...c, [m]: next }
      // Ink on the brand colour follows it until edited by hand.
      if (key === "brand" && c.inkAuto !== false)
        out[m] = { ...next, "brand-ink": inkFor(hex.slice(0, 7)) }
      if (key === "brand-ink") out.inkAuto = false
      return out
    })

  // Charts hold in both modes.
  const setBothModes = (key: string, hex: string) => {
    setColor("light", key, hex)
    setColor("dark", key, hex)
  }

  const radius = toPx(shared("radius"))
  const pill = (custom.controls ?? defaults.controls) === "pill"

  const editor: ThemeEditor = {
    custom,
    defaults,
    color,
    shared,
    setCustom,
    setPx,
    setNum,
    setColor,
    setBothModes,
    radius,
    pill,
  }

  return (
    <aside
      id="customize-sidebar"
      aria-label="Customize"
      inert={!open}
      data-open={open || undefined}
      className="invisible fixed inset-y-0 inset-e-0 z-50 flex w-full translate-x-full flex-col gap-5 overflow-y-auto border-s border-border bg-background px-4 pt-4 pb-6 transition-[translate,visibility] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:w-80 data-open:visible data-open:translate-x-0"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-title font-medium">Customize</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close customize"
          onClick={() => onOpenChange(false)}
        >
          <XIcon />
        </Button>
      </div>

      <ColorSection editor={editor} />
      <StatusChartsSection editor={editor} />
      <ShapeSection editor={editor} />
      <SpacingSection editor={editor} />
      <TypographySection editor={editor} />
      <MotionSection editor={editor} />
      <OutputSection
        editor={editor}
        error={error}
        css={css}
        command={command}
        copied={copied}
        onCopy={onCopy}
        configJson={configJson}
      />

      {/* Stays at the bottom of the panel while the sections scroll. */}
      <div className="sticky -bottom-6 z-10 -mx-4 mt-auto -mb-6 border-t border-border bg-background px-4 py-4">
        <Button className="w-full" disabled={!customized} onClick={onReset}>
          <RotateCcwIcon />
          Reset to theme defaults
        </Button>
      </div>
    </aside>
  )
}
